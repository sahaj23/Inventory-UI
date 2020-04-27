$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/orders",
    dataType: "JSON",
    async: false,
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        getCustomer(data[i].cid, i);
        $("#orderTable tr:last").after(
          "<tr data-toggle='modal' data-id='" +
            data[i].oid +
            "' data-target='#exampleModal'>" +
            "<td scope='row'>" +
            data[i].oid +
            "</td>" +
            "<td id='name" +
            i +
            "'>" +
            name +
            "</td>" +
            "<td>" +
            new Date(data[i].orderDate).toLocaleString() +
            "</td>" +
            "<td>" +
            (data[i].shippedDate === null
              ? "Yet to be shipped"
              : new Date(data[i].shippedDate).toLocaleString()) +
            "</td>" +
            "<td>" +
            data[i].orderStatus +
            "</td>" +
            "</tr>"
        );
      }
    },
    error: function () {
      alert("lol");
    },
  });
});

function getCustomer(data, i) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/customers/" + data,
    dataType: "JSON",
    success: function (data1) {
      $("#name" + i).html(data1.name);
    },
    error: function () {
      alert("lol");
    },
  });
}

$(function () {
  $("#exampleModal")
    .modal({
      keyboard: true,
      backdrop: "static",
      show: false,
    })
    .on("show", function () {
      //make your ajax call populate items or what even you need
      // $(this).find('#orderDetails').html($('<b> Order Id selected: ' + getIdFromRow  + '</b>'))
    });
});

$(document).on("show.bs.modal", "#exampleModal", function (e) {
  var getIdFromRow = $(event.target).closest("tr").data("id");

  $.ajax({
    type: "GET",
    url: "http://localhost:8080/order-item/" + getIdFromRow,
    dataType: "JSON",
    async: false,
    success: function (data) {
      $("#modalBody").html("");
      for (var i = 0; i < data.length; i++) {
        $("#modalBody").append("<p>Product name: " + data[i].pName + "</p>");
        $("#modalBody").append("<p>Quantity : " + data[i].quantity + "</p>");
        $("#modalBody").append("<p>Total: " + data[i].total + "</p><br>");
      }
    },
    error: function () {
      alert("lol");
    },
  });
});
