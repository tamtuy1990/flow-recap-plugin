// Plugin cho "Crack Video Recap & Cut Studio" — tool tải file này lúc chạy (xem pluginHost.ts).
// Hợp đồng: export mount(container, host) → trả hàm dọn dẹp (tuỳ chọn).
// host = { Flow, React, ReactDOM, services: {constants, ffmpegService, geminiService, ...},
//          app: { getNodes, setNodes, getEdges, setEdges } }
export const PHIEN_BAN = '0.1.0';

export function mount(el, host) {
  const { Flow, services = {}, app = {} } = host || {};
  el.innerHTML = `
    <div style="font:14px system-ui,sans-serif;color:#e5e7eb;padding:16px;display:grid;gap:12px">
      <div><b>Plugin đã chạy</b> — bản ${PHIEN_BAN}</div>
      <pre data-id="tt" style="white-space:pre-wrap;background:#111827;padding:12px;border-radius:8px;margin:0"></pre>
      <button data-id="thu" style="justify-self:start;padding:8px 14px;border-radius:8px;border:0;background:#2563eb;color:#fff;cursor:pointer">Gọi thử Flow</button>
      <pre data-id="kq" style="white-space:pre-wrap;margin:0"></pre>
    </div>`;
  const o = (id) => el.querySelector(`[data-id="${id}"]`);

  o('tt').textContent = [
    'Flow: ' + (Flow ? Object.keys(Flow).join(', ') : 'KHÔNG CÓ'),
    'Dịch vụ: ' + Object.keys(services).join(', '),
    'App: ' + Object.keys(app).join(', '),
    'Số nốt trên canvas: ' + (typeof app.getNodes === 'function' ? app.getNodes().length : '?'),
  ].join('\n');

  o('thu').onclick = async () => {
    o('kq').textContent = 'Đang gọi Flow…';
    try {
      const r = await Flow.generate.text('Trả lời đúng một chữ: OK');
      o('kq').textContent = 'Flow trả lời: ' + (r && r.text);
    } catch (e) {
      o('kq').textContent = 'Lỗi: ' + ((e && e.message) || e);
    }
  };

  return () => {
    el.innerHTML = '';
  };
}
