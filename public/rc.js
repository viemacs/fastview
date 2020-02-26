import * as view from "./view.js";

let head = new Vue({
  el: "#head",
  data: {
    site: "FastView",
    siteZH: "快视"
  },
  methods: {
    title: function() {
      return this.siteZH;
    }
  }
});

let viewList = new Vue({
  el: "#view-list",
  data: {
    html: "<ul></ul>"
  },
  methods: {
    List: function() {
      view.Ajax("/viewmodel/list", function(res) {
        let views = res.view;
        let content = "";
        for (let i in views) {
          content += `<li onClick="showView('${views[i].id}')">${views[i].title}</li>`;
        }
        viewList.html = "<ul>" + content + "</ul>";
      });
    }
  }
});

viewList.List();
