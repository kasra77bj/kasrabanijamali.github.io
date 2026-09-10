/*
 * Shared site chrome (nav + footer).
 * Each page sets `const BASE_URL = "./";` (root) or `"../";` (one level deep)
 * before loading this script, so links resolve correctly from any page.
 */
(function () {
  var base = typeof BASE_URL !== "undefined" ? BASE_URL : "./";

  var NAV_LINKS = [
    { label: "Home", href: base + "index.html" },
    { label: "Work Experience", href: base + "experience/index.html" },
    {
      label: "Projects",
      href: base + "projects/index.html",
      children: [
        { label: "All Projects", href: base + "projects/index.html" },
        { label: "Project One", href: base + "projects/project-1.html" },
        { label: "Project Two", href: base + "projects/project-2.html" },
        { label: "Project Three", href: base + "projects/project-3.html" },
        { label: "Project Four", href: base + "projects/project-4.html" },
        { label: "Side Projects", href: base + "projects/side-projects.html" }
      ]
    },
    { label: "Publications", href: base + "publications/index.html" },
    { label: "Awards", href: base + "awards/index.html" },
    { label: "Contact", href: base + "contact/index.html" }
  ];

  function normalizePath(p) {
    if (p.endsWith("/index.html")) p = p.slice(0, -"index.html".length);
    return p || "/";
  }

  function isActive(href) {
    var resolved = new URL(href, window.location.href).pathname;
    return normalizePath(resolved) === normalizePath(window.location.pathname);
  }

  function buildNav() {
    var nav = document.createElement("nav");
    nav.className = "site-nav";

    var container = document.createElement("div");
    container.className = "container";

    var brand = document.createElement("a");
    brand.className = "brand";
    brand.href = base + "index.html";
    brand.textContent = "Kasra Banijamali";

    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";

    var list = document.createElement("ul");
    list.className = "nav-links";

    NAV_LINKS.forEach(function (item) {
      var li = document.createElement("li");

      if (item.children) {
        li.className = "has-dropdown";

        var trigger = document.createElement("button");
        trigger.className = "dropdown-trigger";
        trigger.type = "button";
        trigger.setAttribute("aria-expanded", "false");
        trigger.textContent = item.label;

        trigger.addEventListener("click", function (e) {
          e.stopPropagation();
          var isOpen = li.classList.toggle("open");
          trigger.setAttribute("aria-expanded", String(isOpen));
        });

        var childMenu = document.createElement("ul");
        childMenu.className = "dropdown-menu";

        item.children.forEach(function (child) {
          var childLi = document.createElement("li");
          var childA = document.createElement("a");
          childA.href = child.href;
          childA.textContent = child.label;
          if (isActive(child.href)) {
            childA.classList.add("active");
            trigger.classList.add("active");
          }
          childLi.appendChild(childA);
          childMenu.appendChild(childLi);
        });

        li.appendChild(trigger);
        li.appendChild(childMenu);
      } else {
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        if (isActive(item.href)) a.classList.add("active");
        li.appendChild(a);
      }

      list.appendChild(li);
    });

    container.appendChild(brand);
    container.appendChild(toggle);
    container.appendChild(list);
    nav.appendChild(container);

    toggle.addEventListener("click", function () {
      var isOpen = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function () {
      document.querySelectorAll(".has-dropdown.open").forEach(function (el) {
        el.classList.remove("open");
      });
    });

    return nav;
  }

  function buildFooter() {
    var footer = document.createElement("footer");
    footer.className = "site-footer";

    var container = document.createElement("div");
    container.className = "container";

    var copy = document.createElement("p");
    copy.textContent = "© " + new Date().getFullYear() + " Kasra Banijamali. All rights reserved.";

    var links = document.createElement("div");
    links.className = "footer-links";

    [
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=_eOcBIEAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/kasra-banijamali/" },
      { label: "Contact", href: base + "contact/index.html" }
    ].forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      links.appendChild(a);
    });

    container.appendChild(copy);
    container.appendChild(links);
    footer.appendChild(container);

    return footer;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var headerMount = document.getElementById("site-header");
    var footerMount = document.getElementById("site-footer");

    if (headerMount) headerMount.replaceWith(buildNav());
    if (footerMount) footerMount.replaceWith(buildFooter());
  });
})();
