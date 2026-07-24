# 🚀 AutoUI Framework

Un framework JavaScript ultra-léger basé sur les Web Components et le Shadow DOM.

## 📦 Installation rapide

Ajoute simplement cette ligne dans le `<head>` de ton fichier HTML :

\`\`\`html
<script src="https://cdn.jsdelivr.net/gh/marcisrael25/autoUI@main/autoui.js"></script>
\`\`\`

## 🛠️ Exemple d'utilisation

\`\`\`html
<app-shell theme="dark">
  <nav-bar title="Mon App"></nav-bar>
  <smart-card>
    <h2>Bonjour !</h2>
    <button onclick="AutoUI.toast('Succès !', 'success')">Tester</button>
  </smart-card>
</app-shell>
\`\`\`

## ⚙️ API Système
- `AutoUI.toast(message, type)`
- `AutoUI.openModal(id)`
- `AutoUI.closeModal(id)`
- `AutoUI.toggleTheme()`
