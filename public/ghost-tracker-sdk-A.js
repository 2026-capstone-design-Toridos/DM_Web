/**
 * GhostTracker SDK — Part A
 * 담당: 세션/환경/시간/페이지이동 (17개 이벤트)
 *
 * 사용법:
 *   <script src="ghost-tracker-sdk-A.js" data-endpoint="https://your-api.com/events"></script>
 *
 * 수집 이벤트:
 *   세션/페이지 (7): session_id, page_url, pathname, referrer, utm, visit_time, is_returning
 *   시간 (5):        page_dwell_time, time_to_first_click, inactivity_duration, last_event_time, subsection_dwell_time
 *   페이지이동 (4):   navigation_path, page_depth, exit_page, bounce_flag
 *   환경 (4):        device_type, screen_width, os_type, browser_type
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // 0. 설정
  // ─────────────────────────────────────────────
  const script = document.currentScript;
  const ENDPOINT = script?.getAttribute("data-endpoint") || null;
  const INACTIVITY_THRESHOLD_MS = 30_000; // 30초 비활성 → inactivity 기록

  // ─────────────────────────────────────────────
  // 1. 유틸
  // ─────────────────────────────────────────────
  function now() {
    return Date.now();
  }

  function send(eventType, payload) {
    const body = {
      session_id: STATE.session_id,
      event_type: eventType,
      timestamp: now(),
      seq: STATE.seq++,
      ...payload,
    };

    // 콘솔 미리보기 (개발 확인용)
    console.debug("[GhostTracker-A]", eventType, body);

    if (!ENDPOINT) return;

    // sendBeacon 우선 (beforeunload 안전), 실패 시 fetch fallback
    const blob = new Blob([JSON.stringify(body)], {
      type: "application/json",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }

  // ─────────────────────────────────────────────
  // 2. 세션 초기화
  // ─────────────────────────────────────────────
  function initSession() {
    const existing = localStorage.getItem("gt_session_id");
    const existingTime = localStorage.getItem("gt_session_time");
    const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30분 세션 만료

    const isExpired =
      !existingTime || now() - parseInt(existingTime) > SESSION_TIMEOUT_MS;

    if (existing && !isExpired) {
      return { session_id: existing, is_returning: true };
    }

    const newId = crypto.randomUUID();
    localStorage.setItem("gt_session_id", newId);
    localStorage.setItem("gt_session_time", String(now()));
    return { session_id: newId, is_returning: !!existing };
  }

  // ─────────────────────────────────────────────
  // 3. 환경 정보 파싱
  // ─────────────────────────────────────────────
  function getEnvInfo() {
    const ua = navigator.userAgent;

    // 디바이스 타입
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const device_type = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    // OS
    let os_type = "unknown";
    if (/Windows/i.test(ua)) os_type = "windows";
    else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) os_type = "mac";
    else if (/iPhone/i.test(ua)) os_type = "ios";
    else if (/iPad/i.test(ua)) os_type = "ipados";
    else if (/Android/i.test(ua)) os_type = "android";
    else if (/Linux/i.test(ua)) os_type = "linux";

    // 브라우저
    let browser_type = "unknown";
    if (/Edg\//i.test(ua)) browser_type = "edge";
    else if (/OPR\/|Opera/i.test(ua)) browser_type = "opera";
    else if (/Chrome/i.test(ua)) browser_type = "chrome";
    else if (/Safari/i.test(ua)) browser_type = "safari";
    else if (/Firefox/i.test(ua)) browser_type = "firefox";

    return {
      device_type,
      screen_width: window.innerWidth,
      os_type,
      browser_type,
    };
  }

  // ─────────────────────────────────────────────
  // 4. UTM 파싱
  // ─────────────────────────────────────────────
  function getUtm() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
      utm_content: params.get("utm_content") || null,
    };
  }

  // ─────────────────────────────────────────────
  // 5. 전역 상태
  // ─────────────────────────────────────────────
  const sessionInfo = initSession();
  const envInfo = getEnvInfo();
  const utmInfo = getUtm();

  const STATE = {
    session_id: sessionInfo.session_id,
    seq: 0,

    // 시간
    page_start_time: now(),
    first_click_time: null,
    last_event_time: now(),
    inactivity_start: now(),
    inactivity_timer: null,

    // 페이지 이동
    navigation_path: [window.location.pathname],
    has_interacted: false,

    // subsection 체류 (B파트와 협력 — enter 이벤트 수신용)
    subsection_enter_times: {},
  };

  // ─────────────────────────────────────────────
  // 6. session_start 이벤트 (페이지 로드 시 1회)
  // ─────────────────────────────────────────────
  send("session_start", {
    page_url: window.location.href,
    pathname: window.location.pathname,
    referrer: document.referrer || null,
    visit_time: STATE.page_start_time,
    is_returning: sessionInfo.is_returning,
    ...envInfo,
    ...utmInfo,
  });

  // ─────────────────────────────────────────────
  // 7. 첫 클릭까지 시간 (time_to_first_click)
  //    — B파트의 click 이벤트와 별개로, 타이밍만 A가 기록
  // ─────────────────────────────────────────────
  function onFirstInteraction() {
    if (STATE.first_click_time !== null) return;
    STATE.first_click_time = now();
    STATE.has_interacted = true;
    send("time_to_first_click", {
      duration_ms: STATE.first_click_time - STATE.page_start_time,
    });
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("touchstart", onFirstInteraction);
  }
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("touchstart", onFirstInteraction);

  // ─────────────────────────────────────────────
  // 8. 비활성 감지 (inactivity_duration)
  // ─────────────────────────────────────────────
  function resetInactivityTimer() {
    STATE.last_event_time = now();
    clearTimeout(STATE.inactivity_timer);
    STATE.inactivity_timer = setTimeout(() => {
      const duration_ms = now() - STATE.last_event_time;
      send("inactivity", {
        duration_ms,
        last_event_time: STATE.last_event_time,
      });
    }, INACTIVITY_THRESHOLD_MS);
  }

  ["click", "mousemove", "scroll", "keydown", "touchstart"].forEach((evt) => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();

  // ─────────────────────────────────────────────
  // 9. 페이지 이동 감지 (SPA 대응)
  //    history.pushState / popstate 모두 감지
  // ─────────────────────────────────────────────
  function onNavigate(newPath) {
    STATE.navigation_path.push(newPath);
    send("page_navigate", {
      from: STATE.navigation_path[STATE.navigation_path.length - 2] || null,
      to: newPath,
      page_depth: STATE.navigation_path.length,
      navigation_path: [...STATE.navigation_path],
    });
  }

  // pushState 오버라이드
  const _pushState = history.pushState.bind(history);
  history.pushState = function (state, title, url) {
    _pushState(state, title, url);
    onNavigate(window.location.pathname);
  };

  // replaceState 오버라이드
  const _replaceState = history.replaceState.bind(history);
  history.replaceState = function (state, title, url) {
    _replaceState(state, title, url);
    onNavigate(window.location.pathname);
  };

  window.addEventListener("popstate", () => {
    onNavigate(window.location.pathname);
  });

  // ─────────────────────────────────────────────
  // 10. 이탈 감지 (beforeunload)
  //     page_dwell_time, exit_page, bounce_flag
  // ─────────────────────────────────────────────
  window.addEventListener("beforeunload", () => {
    const dwell_ms = now() - STATE.page_start_time;
    const is_bounce =
      STATE.navigation_path.length === 1 && !STATE.has_interacted;

    send("session_exit", {
      page_dwell_time_ms: dwell_ms,
      exit_page: window.location.pathname,
      bounce_flag: is_bounce,
      page_depth: STATE.navigation_path.length,
      navigation_path: [...STATE.navigation_path],
      last_event_time: STATE.last_event_time,
    });
  });

  // ─────────────────────────────────────────────
  // 11. subsection 체류 시간 수신 API
  //     C파트(IntersectionObserver)가 subsection enter/exit 시
  //     이 함수를 호출해 A파트가 시간을 기록
  // ─────────────────────────────────────────────
  window.__GT = window.__GT || {};

  window.__GT.subsectionEnter = function (subsection_id) {
    STATE.subsection_enter_times[subsection_id] = now();
  };

  window.__GT.subsectionExit = function (subsection_id) {
    const enter_time = STATE.subsection_enter_times[subsection_id];
    if (!enter_time) return;
    const dwell_ms = now() - enter_time;
    delete STATE.subsection_enter_times[subsection_id];
    send("subsection_dwell", {
      subsection_id,
      dwell_ms,
    });
  };

  // ─────────────────────────────────────────────
  // 12. 화면 크기 변화 감지 (리사이즈)
  // ─────────────────────────────────────────────
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      send("screen_resize", {
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      });
    }, 500);
  });

  // ─────────────────────────────────────────────
  // 외부 접근용 네임스페이스
  // ─────────────────────────────────────────────
  window.__GT.state = STATE;
  window.__GT.send = send;

  console.info(
    "[GhostTracker-A] SDK loaded. session_id:",
    STATE.session_id,
    "| returning:",
    sessionInfo.is_returning
  );
})();