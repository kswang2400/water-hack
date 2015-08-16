WaterHack.Views.UsageDashboard = Backbone.CompositeView.extend({
  template: JST["usages/usage_dashboard"],
  tagName: "main",
  className: "usage-dashboard container",

  events: {
  },

  initialize: function(options) {
    this.products = options.products;

    $.ajax({
      url: "/api/list_account_ids",
      type: "GET",
      success: function(resp) {
        this.account_ids = resp;
        this.renderViews();
        this.render();
      }.bind(this)
    });

    this.listenTo(this.collection, "sync", this.render);
  },

  onRender: function () {
    setTimeout(function () {
      $(".product-list")
        .on("click", ".product-item", this.useProduct.bind(this));

      Backbone.CompositeView.prototype.onRender.call(this);
    }.bind(this), 0);
  },

  render: function() {
    var content = this.template({
      usages: this.collection,
      account_ids: this.account_ids
    });
    this.$el.html(content);
    this.attachSubviews();
    this.onRender();

    $(".active").removeClass("active");
    $("select").on("change", this.selectAccount.bind(this));

    return this;
  },

  renderViews: function() {
    var usageSidebar = new WaterHack.Views.UsageSidebar({
      collection: this.products,
      account_ids: this.account_ids
    });

    var usageShow = new WaterHack.Views.UsageShow({
      collection: this.collection
    });

    this.addSubview(".dashboard-sidebar", usageSidebar);
    this.addSubview(".dashboard-details", usageShow);
  },

  selectAccount: function(e) {
    var account_id = e.currentTarget.value;

    this.collection.fetch({
      data: {
        account_id: account_id
      }
    });
  },

  useProduct: function(e) {
    e.preventDefault();
    var efficiency = $(e.currentTarget).data("efficiency");
    $(e.currentTarget).toggleClass("active");
  }
});
