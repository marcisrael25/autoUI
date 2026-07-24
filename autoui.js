/**
 * AutoUI v12.0 Enterprise Suite - Complete Framework Engine
 * Fully Expanded Component Suite (~755 Lines of Clean, Modular Code)
 * Encapsulated Shadow DOM | Custom CSS API | Custom Events | Zero External Dependencies
 */

// ---------------------------------------------------------------------------
// 1. STYLES SYSTEM & ENGINE
// ---------------------------------------------------------------------------
const defaultGlobalStyles = `
  :root {
    --bg-main: #0f172a;
    --bg-card: #1e293b;
    --border-color: #334155;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --accent: #3b82f6;
    --accent-hover: #2563eb;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --radius: 8px;
    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }
  [data-theme="light"] {
    --bg-main: #f8fafc;
    --bg-card: #ffffff;
    --border-color: #e2e8f0;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
  body { background-color: var(--bg-main); color: var(--text-main); min-height: 100vh; width: 100%; overflow-x: hidden; }

  button {
    background: var(--accent); color: #ffffff; border: none; padding: 0.6rem 1.2rem;
    border-radius: var(--radius); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s, transform 0.1s;
  }
  button:hover { background: var(--accent-hover); }
  button:active { transform: scale(0.98); }
`;

const globalSheet = new CSSStyleSheet();
globalSheet.replaceSync(defaultGlobalStyles);
document.adoptedStyleSheets = [globalSheet];

const customShadowSheet = new CSSStyleSheet();
const commonComponentCSS = `
  :host { display: block; width: 100%; box-sizing: border-box; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
`;

function attachComponentStyle(shadow) {
  const componentSheet = new CSSStyleSheet();
  shadow.adoptedStyleSheets = [componentSheet, customShadowSheet];
  return componentSheet;
}

// ---------------------------------------------------------------------------
// 2. GLOBAL SYSTEM API
// ---------------------------------------------------------------------------
window.AutoUI = {
  toggleTheme: () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.dispatchEvent(new CustomEvent('autoui-theme-change', { detail: { theme: nextTheme } }));
  },

  registerStyle: (cssString) => {
    try {
      customShadowSheet.replaceSync(cssString);
      console.log('⚡ [AutoUI] Styles développeur appliqués dans tous les composants.');
    } catch (err) {
      console.error('❌ [AutoUI] Erreur lors de l\'injection CSS :', err);
    }
  },

  toast: (message, type = 'info') => {
    let toaster = document.querySelector('smart-toast');
    if (!toaster) {
      toaster = document.createElement('smart-toast');
      document.body.appendChild(toaster);
    }
    toaster.push(message, type);
  },

  openModal: (id) => {
    const modal = document.getElementById(id);
    if (modal && typeof modal.open === 'function') modal.open();
  },

  closeModal: (id) => {
    const modal = document.getElementById(id);
    if (modal && typeof modal.close === 'function') modal.close();
  },

  copyToClipboard: (text) => {
    navigator.clipboard.writeText(text).then(() => {
      window.AutoUI.toast('Copié dans le presse-papier !', 'success');
    }).catch(() => {
      window.AutoUI.toast('Échec de la copie.', 'danger');
    });
  }
};

// ---------------------------------------------------------------------------
// 3. LAYOUT & CORE STRUCTURE COMPONENTS
// ---------------------------------------------------------------------------
class AppShell extends HTMLElement {
  connectedCallback() {
    document.documentElement.setAttribute('data-theme', this.getAttribute('theme') || 'dark');
    const hasSidebar = !!this.querySelector('[slot="sidebar"]');
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .shell { display: flex; min-height: 100vh; width: 100%; }
      .sidebar-container { width: 260px; flex-shrink: 0; display: ${hasSidebar ? 'block' : 'none'}; }
      main { flex-grow: 1; padding: 2rem; width: 100%; max-width: 1400px; margin: 0 auto; overflow-y: auto; }
      @media (max-width: 850px) {
        .shell { flex-direction: column; }
        .sidebar-container { width: 100%; }
        main { padding: 1rem; }
      }
    `);
    shadow.innerHTML = `
      <div class="shell">
        <div class="sidebar-container"><slot name="sidebar"></slot></div>
        <main><slot></slot></main>
      </div>
    `;
  }
}

class SideBar extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      aside { background: var(--bg-card); border-right: 1px solid var(--border-color); height: 100%; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
      ::slotted(a) { color: var(--text-muted); text-decoration: none; padding: 0.75rem 1rem; border-radius: var(--radius); font-weight: 500; transition: all 0.2s; display: block; }
      ::slotted(a:hover), ::slotted(a.active) { background: var(--bg-main); color: var(--accent); }
    `);
    shadow.innerHTML = `<aside><slot></slot></aside>`;
  }
}

class NavBar extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); margin-bottom: 1.5rem; border-radius: var(--radius); }
      .logo { font-weight: 700; font-size: 1.15rem; color: var(--text-main); }
      .actions { display: flex; gap: 0.75rem; align-items: center; }
      #themeBtn { background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-main); }
    `);
    shadow.innerHTML = `
      <header>
        <div class="logo">${this.getAttribute('title') || 'Dashboard'}</div>
        <div class="actions"><slot></slot><button id="themeBtn">🌓 Thème</button></div>
      </header>
    `;
    shadow.querySelector('#themeBtn').onclick = () => window.AutoUI.toggleTheme();
  }
}

class AutoGrid extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
    `);
    shadow.innerHTML = `<div class="grid"><slot></slot></div>`;
  }
}

class SmartCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.25rem; box-shadow: var(--shadow); }
    `);
    shadow.innerHTML = `<div class="card"><slot></slot></div>`;
  }
}

class SmartDivider extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .divider { display: flex; align-items: center; text-align: center; color: var(--text-muted); font-size: 0.8rem; margin: 1.5rem 0; }
      .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-color); }
      .divider:not(:empty)::before { margin-right: .8em; }
      .divider:not(:empty)::after { margin-left: .8em; }
    `);
    shadow.innerHTML = `<div class="divider"><slot></slot></div>`;
  }
}

// ---------------------------------------------------------------------------
// 4. NAVIGATION, TABS & ACCORDIONS
// ---------------------------------------------------------------------------
class SmartTabs extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(this.shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .nav { display: flex; border-bottom: 1px solid var(--border-color); gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; }
      .tab-btn { background: none; border: none; padding: 0.75rem 1.25rem; color: var(--text-muted); cursor: pointer; font-weight: 600; border-bottom: 2px solid transparent; white-space: nowrap; }
      .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
    `);
    this.shadow.innerHTML = `<div class="nav" id="nav"></div><slot></slot>`;
    setTimeout(() => this.initTabs(), 0);
  }

  initTabs() {
    const items = Array.from(this.querySelectorAll('tab-item'));
    const nav = this.shadow.querySelector('#nav');
    nav.innerHTML = '';

    items.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = item.getAttribute('label') || `Onglet ${idx + 1}`;
      
      btn.onclick = () => {
        this.shadow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        items.forEach((it, i) => it.style.display = i === idx ? 'block' : 'none');
        this.dispatchEvent(new CustomEvent('autoui-tab-change', { detail: { index: idx, label: btn.textContent }, bubbles: true, composed: true }));
      };
      
      nav.appendChild(btn);
      item.style.display = idx === 0 ? 'block' : 'none';
    });
  }
}
class TabItem extends HTMLElement { connectedCallback() { this.style.display = 'block'; } }

class SmartAccordion extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`${commonComponentCSS}`);
    shadow.innerHTML = `<slot></slot>`;
  }
}

class AccordionItem extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .item { border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 0.5rem; overflow: hidden; }
      .head { background: var(--bg-card); padding: 1rem; cursor: pointer; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
      .body { padding: 1rem; display: none; background: var(--bg-main); border-top: 1px solid var(--border-color); }
      .open .body { display: block; }
    `);
    shadow.innerHTML = `
      <div class="item" id="it">
        <div class="head" id="h">${this.getAttribute('title')} <span>▼</span></div>
        <div class="body"><slot></slot></div>
      </div>
    `;
    shadow.querySelector('#h').onclick = () => shadow.querySelector('#it').classList.toggle('open');
  }
}

class SmartBreadcrumb extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      nav { display: flex; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem; }
      ::slotted(a) { color: var(--accent); text-decoration: none; }
    `);
    shadow.innerHTML = `<nav><slot></slot></nav>`;
  }
}

class SmartDropdown extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      :host { position: relative; display: inline-block; }
      .menu { position: absolute; top: 110%; right: 0; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); box-shadow: var(--shadow); display: none; flex-direction: column; min-width: 160px; z-index: 500; overflow: hidden; }
      .menu.open { display: flex; }
      ::slotted(a), ::slotted(button) { padding: 0.6rem 1rem; color: var(--text-main); text-decoration: none; background: none; border: none; text-align: left; width: 100%; font-size: 0.85rem; cursor: pointer; }
      ::slotted(a:hover), ::slotted(button:hover) { background: var(--bg-main); color: var(--accent); }
    `);
    shadow.innerHTML = `
      <button id="trigger">${this.getAttribute('label') || 'Options'} ▾</button>
      <div class="menu" id="menu"><slot></slot></div>
    `;
    const trigger = shadow.querySelector('#trigger');
    const menu = shadow.querySelector('#menu');
    trigger.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('open'); };
    window.addEventListener('click', () => menu.classList.remove('open'));
  }
}

// ---------------------------------------------------------------------------
// 5. FORMS, INPUTS & CONTROLS
// ---------------------------------------------------------------------------
class SmartForm extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      form { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; width: 100%; }
      ::slotted(input:not([type="checkbox"]):not([type="radio"]):not([type="range"])), ::slotted(textarea), ::slotted(select) {
        width: 100%; padding: 0.75rem 1rem; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius); color: var(--text-main); font-size: 0.95rem;
      }
      ::slotted(label) { display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-main); font-size: 0.9rem; font-weight: 500; }
      .actions { display: flex; justify-content: flex-end; margin-top: 0.5rem; }
    `);
    shadow.innerHTML = `
      <form id="form">
        <slot></slot>
        <div class="actions">
          <button type="submit">${this.getAttribute('button') || 'Envoyer'}</button>
        </div>
      </form>
    `;
    shadow.querySelector('#form').onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      this.dispatchEvent(new CustomEvent('autoui-submit', { detail: data, bubbles: true, composed: true }));
      window.AutoUI.toast('Formulaire envoyé avec succès !', 'success');
    };
  }
}

class SmartSwitch extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .sw { width: 44px; height: 24px; background: var(--border-color); border-radius: 12px; position: relative; cursor: pointer; transition: background 0.3s; }
      .dot { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: transform 0.3s; }
      .active { background: var(--success); } .active .dot { transform: translateX(20px); }
    `);
    shadow.innerHTML = `<div class="sw" id="s"><div class="dot"></div></div>`;
    const toggle = shadow.querySelector('#s');
    toggle.onclick = () => {
      toggle.classList.toggle('active');
      this.dispatchEvent(new CustomEvent('autoui-change', { detail: { active: toggle.classList.contains('active') }, bubbles: true, composed: true }));
    };
  }
}

class SmartSearch extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      input { width: 100%; padding: 0.75rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); color: var(--text-main); outline: none; }
    `);
    shadow.innerHTML = `<input type="text" placeholder="${this.getAttribute('placeholder') || 'Rechercher...'}" id="in" />`;
    shadow.querySelector('#in').oninput = (e) => {
      this.dispatchEvent(new CustomEvent('autoui-search', { detail: { value: e.target.value }, bubbles: true, composed: true }));
    };
  }
}

class SmartSlider extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .wrapper { display: flex; align-items: center; gap: 1rem; }
      input { flex-grow: 1; accent-color: var(--accent); cursor: pointer; }
      span { font-weight: 600; font-size: 0.85rem; min-width: 35px; text-align: right; }
    `);
    const min = this.getAttribute('min') || '0';
    const max = this.getAttribute('max') || '100';
    const val = this.getAttribute('value') || '50';
    shadow.innerHTML = `<div class="wrapper"><input type="range" id="r" min="${min}" max="${max}" value="${val}" /><span id="v">${val}</span></div>`;
    const r = shadow.querySelector('#r');
    const v = shadow.querySelector('#v');
    r.oninput = (e) => {
      v.textContent = e.target.value;
      this.dispatchEvent(new CustomEvent('autoui-slide', { detail: { value: e.target.value }, bubbles: true, composed: true }));
    };
  }
}

class SmartTagInput extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(this.shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .box { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); align-items: center; }
      .tag { background: var(--accent); color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; }
      .tag span { cursor: pointer; font-weight: bold; }
      input { border: none; background: transparent; color: var(--text-main); flex-grow: 1; outline: none; font-size: 0.85rem; padding: 0.2rem; }
    `);
    this.tags = [];
    this.shadow.innerHTML = `<div class="box" id="b"><input type="text" id="i" placeholder="Ajouter un tag..." /></div>`;
    const input = this.shadow.querySelector('#i');
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        this.addTag(input.value.trim());
        input.value = '';
      }
    };
  }
  addTag(val) {
    if (this.tags.includes(val)) return;
    this.tags.push(val);
    this.render();
  }
  removeTag(val) {
    this.tags = this.tags.filter(t => t !== val);
    this.render();
  }
  render() {
    const box = this.shadow.querySelector('#b');
    const input = this.shadow.querySelector('#i');
    box.querySelectorAll('.tag').forEach(t => t.remove());
    this.tags.forEach(t => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `${t} <span>&times;</span>`;
      tag.querySelector('span').onclick = () => this.removeTag(t);
      box.insertBefore(tag, input);
    });
  }
}

class SmartFileUpload extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .dropzone { border: 2px dashed var(--border-color); border-radius: var(--radius); padding: 2rem; text-align: center; background: var(--bg-card); cursor: pointer; transition: border-color 0.2s; }
      .dropzone:hover { border-color: var(--accent); }
      p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.4rem; }
    `);
    shadow.innerHTML = `<div class="dropzone" id="d">📁 <strong>Déposer un fichier</strong> ou cliquer pour sélectionner<p>Fichiers supportés : PNG, JPG, PDF</p><input type="file" id="f" hidden /></div>`;
    const d = shadow.querySelector('#d');
    const f = shadow.querySelector('#f');
    d.onclick = () => f.click();
    f.onchange = (e) => {
      if (e.target.files.length) {
        window.AutoUI.toast(`Fichier prêt : ${e.target.files[0].name}`, 'info');
      }
    };
  }
}

class SmartRating extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    const score = parseInt(this.getAttribute('value') || '3');
    sheet.replaceSync(`${commonComponentCSS} .stars { color: var(--warning); font-size: 1.25rem; letter-spacing: 2px; }`);
    shadow.innerHTML = `<div class="stars">${'★'.repeat(score)}${'☆'.repeat(5 - score)}</div>`;
  }
}

// ---------------------------------------------------------------------------
// 6. DATA VISUALIZATION, CHARTS & TABLES
// ---------------------------------------------------------------------------
class DataTable extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(this.shadow);
    sheet.replaceSync(`${commonComponentCSS}`);
    const src = this.getAttribute('src');
    if (src) {
      fetch(src)
        .then(r => r.json())
        .then(d => this.render(Array.isArray(d) ? d : d.items || []))
        .catch(() => this.shadow.innerHTML = `<p style="padding:1rem;color:var(--danger)">Erreur de chargement des données.</p>`);
    }
  }

  render(data) {
    if (!data.length) return;
    const keys = Object.keys(data[0]).slice(0, 6);
    this.shadow.innerHTML = `
      <style>
        .wrapper { overflow-x: auto; width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius); }
        table { width: 100%; border-collapse: collapse; background: var(--bg-card); text-align: left; }
        th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; }
        th { background: var(--bg-main); color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
      </style>
      <div class="wrapper">
        <table>
          <thead><tr>${keys.map(k=>`<th>${k}</th>`).join('')}</tr></thead>
          <tbody>${data.map(r=>`<tr>${keys.map(k=>`<td>${r[k] !== null ? r[k] : ''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    `;
  }
}

class SmartStat extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.25rem; }
      .val { font-size: 1.8rem; font-weight: 700; color: var(--text-main); margin-top: 0.25rem; }
    `);
    shadow.innerHTML = `
      <div class="card">
        <div style="color:var(--text-muted); font-size:0.85rem">${this.getAttribute('title')}</div>
        <div class="val">${this.getAttribute('value')}</div>
      </div>
    `;
  }
}

class SmartBarChart extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .chart { display: flex; align-items: flex-end; gap: 1rem; height: 150px; padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); }
      .bar-container { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; gap: 0.4rem; }
      .bar { width: 100%; background: var(--accent); border-radius: 4px 4px 0 0; transition: height 0.5s ease; }
      .label { font-size: 0.7rem; color: var(--text-muted); }
    `);
    const data = JSON.parse(this.getAttribute('data') || '[{"label":"A","value":40},{"label":"B","value":80},{"label":"C","value":60}]');
    const max = Math.max(...data.map(d => d.value)) || 100;
    
    shadow.innerHTML = `
      <div class="chart">
        ${data.map(d => `
          <div class="bar-container">
            <div class="bar" style="height: ${(d.value / max) * 100}%"></div>
            <span class="label">${d.label}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

class SmartTree extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      ul { list-style: none; padding-left: 1rem; }
      li { margin: 0.4rem 0; font-size: 0.85rem; color: var(--text-main); }
      .folder { font-weight: bold; cursor: pointer; color: var(--accent); }
    `);
    shadow.innerHTML = `
      <ul>
        <li><span class="folder">📁 src</span>
          <ul>
            <li>📄 index.js</li>
            <li>📄 autoui.js</li>
          </ul>
        </li>
        <li>📄 package.json</li>
      </ul>
    `;
  }
}

// ---------------------------------------------------------------------------
// 7. OVERLAYS, MODALS & TOASTS
// ---------------------------------------------------------------------------
class SmartModal extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(this.shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; z-index: 10000; padding: 1rem; }
      .backdrop.active { opacity: 1; pointer-events: auto; }
      .modal { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.5rem; width: 100%; max-width: 550px; box-shadow: var(--shadow); max-height: 90vh; overflow-y: auto; }
      .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; }
      .close-btn { background: none; color: var(--text-muted); font-size: 1.2rem; padding: 0.2rem 0.5rem; }
    `);
    this.shadow.innerHTML = `
      <div class="backdrop" id="bd">
        <div class="modal">
          <div class="head">
            <h3>${this.getAttribute('title') || 'Modal'}</h3>
            <button class="close-btn" id="close">&times;</button>
          </div>
          <slot></slot>
        </div>
      </div>
    `;
    this.shadow.querySelector('#bd').onclick = (e) => { if (e.target.id === 'bd') this.close(); };
    this.shadow.querySelector('#close').onclick = () => this.close();
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
  }
  open() { this.shadow.querySelector('#bd').classList.add('active'); }
  close() { this.shadow.querySelector('#bd').classList.remove('active'); }
}

class SmartToast extends HTMLElement {
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(this.shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .box { position: fixed; bottom: 20px; right: 20px; z-index: 20000; display: flex; flex-direction: column; gap: 8px; }
      .t { padding: 0.8rem 1.2rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); color: var(--text-main); box-shadow: var(--shadow); }
    `);
    this.shadow.innerHTML = `<div class="box" id="b"></div>`;
  }
  push(m) {
    const box = this.shadow.querySelector('#b');
    const toast = document.createElement('div');
    toast.className = 't';
    toast.textContent = m;
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

class SmartTooltip extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      :host { position: relative; display: inline-block; }
      .tip { position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); padding: 0.4rem 0.8rem; background: #000; color: #fff; font-size: 0.75rem; border-radius: 6px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
      :host(:hover) .tip { opacity: 1; }
    `);
    shadow.innerHTML = `<slot></slot><div class="tip">${this.getAttribute('text')}</div>`;
  }
}

// ---------------------------------------------------------------------------
// 8. FEEDBACK, PROGRESS, SPINNERS & CODE UTILITIES
// ---------------------------------------------------------------------------
class SmartProgress extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    const val = this.getAttribute('value') || '0';
    sheet.replaceSync(`
      ${commonComponentCSS}
      .track { width: 100%; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; height: 12px; overflow: hidden; }
      .fill { height: 100%; background: var(--accent); width: ${val}%; transition: width 0.3s ease; }
    `);
    shadow.innerHTML = `<div class="track"><div class="fill"></div></div>`;
  }
}

class SmartSpinner extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      :host { display: inline-block; }
      .spin { width: 24px; height: 24px; border: 3px solid var(--border-color); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `);
    shadow.innerHTML = `<div class="spin"></div>`;
  }
}

class SmartCodeBlock extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .code-box { background: #000; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1rem; position: relative; font-family: monospace; font-size: 0.85rem; color: #10b981; overflow-x: auto; }
      .copy-btn { position: absolute; top: 8px; right: 8px; font-size: 0.7rem; padding: 0.2rem 0.5rem; background: var(--bg-card); border: 1px solid var(--border-color); color: #fff; }
    `);
    const code = this.textContent.trim();
    shadow.innerHTML = `
      <div class="code-box">
        <button class="copy-btn" id="cp">Copier</button>
        <pre><code>${code}</code></pre>
      </div>
    `;
    shadow.querySelector('#cp').onclick = () => window.AutoUI.copyToClipboard(code);
  }
}

class SmartAvatar extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    const status = this.getAttribute('status');
    sheet.replaceSync(`
      ${commonComponentCSS}
      :host { display: inline-block; position: relative; }
      .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; overflow: hidden; }
      img { width: 100%; height: 100%; object-fit: cover; }
      .dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--bg-card); }
      .online { background: var(--success); } .busy { background: var(--danger); }
    `);
    shadow.innerHTML = `
      <div class="avatar">${this.getAttribute('src') ? `<img src="${this.getAttribute('src')}">` : (this.getAttribute('name') || 'U')[0]}</div>
      ${status ? `<div class="dot ${status}"></div>` : ''}
    `;
  }
}

class SmartBadge extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      :host { display: inline-block; }
      .badge { padding: 0.25rem 0.65rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
      .info { background: rgba(59,130,246,0.15); color: var(--accent); }
      .success { background: rgba(16,185,129,0.15); color: var(--success); }
      .danger { background: rgba(239,68,68,0.15); color: var(--danger); }
    `);
    shadow.innerHTML = `<span class="badge ${this.getAttribute('type') || 'info'}"><slot></slot></span>`;
  }
}

class SmartAlert extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .alert { padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.9rem; border: 1px solid transparent; }
      .info { background: rgba(59,130,246,0.1); border-color: var(--accent); color: var(--accent); }
      .success { background: rgba(16,185,129,0.1); border-color: var(--success); color: var(--success); }
      .danger { background: rgba(239,68,68,0.1); border-color: var(--danger); color: var(--danger); }
    `);
    shadow.innerHTML = `<div class="alert ${this.getAttribute('type') || 'info'}"><slot></slot></div>`;
  }
}

class SmartSkeleton extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .sk { background: linear-gradient(90deg, var(--bg-card) 25%, var(--border-color) 50%, var(--bg-card) 75%); background-size: 200% 100%; animation: loading 1.5s infinite; height: ${this.getAttribute('height') || '20px'}; border-radius: 6px; margin-bottom: 0.5rem; }
      @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `);
    shadow.innerHTML = `<div class="sk"></div>`;
  }
}

class SmartPagination extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    const totalPages = parseInt(this.getAttribute('total') || '5');
    sheet.replaceSync(`
      ${commonComponentCSS}
      .pag { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; }
      button { background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-main); padding: 0.4rem 0.8rem; }
    `);
    shadow.innerHTML = `
      <div class="pag">
        <button>«</button>
        ${Array.from({length: totalPages}, (_, i) => `<button>${i + 1}</button>`).join('')}
        <button>»</button>
      </div>
    `;
  }
}

class SmartStep extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .st { display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1rem; }
    `);
    shadow.innerHTML = `<div class="st"><slot></slot></div>`;
  }
}

class StepItem extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const sheet = attachComponentStyle(shadow);
    sheet.replaceSync(`
      ${commonComponentCSS}
      .step { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }
      :host([active]) .step { color: var(--accent); }
    `);
    shadow.innerHTML = `<div class="step"><span>•</span><slot></slot></div>`;
  }
}

// ---------------------------------------------------------------------------
// 9. CUSTOM ELEMENTS REGISTRATION
// ---------------------------------------------------------------------------
const componentsToDefine = {
  'app-shell': AppShell,
  'side-bar': SideBar,
  'nav-bar': NavBar,
  'auto-grid': AutoGrid,
  'smart-card': SmartCard,
  'smart-divider': SmartDivider,
  'smart-tabs': SmartTabs,
  'tab-item': TabItem,
  'smart-accordion': SmartAccordion,
  'accordion-item': AccordionItem,
  'smart-breadcrumb': SmartBreadcrumb,
  'smart-dropdown': SmartDropdown,
  'smart-form': SmartForm,
  'smart-switch': SmartSwitch,
  'smart-search': SmartSearch,
  'smart-slider': SmartSlider,
  'smart-tag-input': SmartTagInput,
  'smart-file-upload': SmartFileUpload,
  'smart-rating': SmartRating,
  'data-table': DataTable,
  'smart-stat': SmartStat,
  'smart-bar-chart': SmartBarChart,
  'smart-tree': SmartTree,
  'smart-modal': SmartModal,
  'smart-toast': SmartToast,
  'smart-tooltip': SmartTooltip,
  'smart-progress': SmartProgress,
  'smart-spinner': SmartSpinner,
  'smart-code-block': SmartCodeBlock,
  'smart-avatar': SmartAvatar,
  'smart-badge': SmartBadge,
  'smart-alert': SmartAlert,
  'smart-skeleton': SmartSkeleton,
  'smart-pagination': SmartPagination,
  'smart-step': SmartStep,
  'step-item': StepItem
};

Object.entries(componentsToDefine).forEach(([tagName, componentClass]) => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);
  }
});