$(document).ready(function () {
  dPoints = {};
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/order-item",
    dataType: "JSON",
    async: false,
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        total = data[i].quantity;
        pid = data[i].pid;
        $.ajax({
          type: "GET",
          url: "http://localhost:8080/products/" + pid,
          dataType: "JSON",
          async: false,
          success: function (data1) {
            console.log(data1);
            $.ajax({
              type: "GET",
              url: "http://localhost:8080/categories/" + data1.cid,
              dataType: "JSON",
              success: function (data2) {
                if (dPoints[data2.categoryName] === undefined) {
                  dPoints[data2.categoryName] = total;
                } else {
                  dPoints[data2.categoryName] += total;
                  console.log(Object.keys(dPoints) + " " + dPoints["Books"]);
                }
                console.log(i + " " + data.length);
                if (i === data.length - 1) {
                  drawChart(dPoints);
                }
              },
              error: function (e) {
                console.log(e);
              },
            });
          },
          error: function () {
            alert("error");
          },
        });
      }
    },
    error: function () {
      alert("lol");
    },
  });

  //console.log(dPoints);
  //alert("here");
  // drawChart(dPoints);
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/orders",
    dataType: "JSON",
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        getCustomer(data[i].cid, i);
        $("#orderTable tr:last").after(
          "<tr>" +
            "<td scope='row'>" +
            data[i].oid +
            "</td>" +
            "<td id='name" +
            i +
            "'>" +
            data[i].cid +
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

  //Total Users
  var totalUsers = 0;
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/customers",
    dataType: "JSON",
    success: function (data) {
      totalUsers = data.length;
      $("#totalUsers").html(totalUsers);
    },
    error: function () {
      alert("lol");
    },
  });

  //Pending orders
  pending = 0;
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/orders",
    dataType: "JSON",
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].orderStatus !== "Delivered") {
          pending++;
        }
        if (i === data.length - 1) {
          $("#pendingOrders").html(pending);
        }
      }
    },
    error: function () {
      alert("lol");
    },
  });

  //Total sale
  sale = 0;
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/order-item",
    dataType: "JSON",
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        sale += data[i].total;

        if (i === data.length - 1) {
          $("#totalSale").html(sale);
        }
      }
    },
    error: function () {
      alert("lol");
    },
  });
});

function addOrder() {
  var data = {
    cid: $("#custId").val(),
    orderStatus: "Initiated",
    orderDate: new Date(),
    shippedDate: null,
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/orders",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(data),
    async: false,
    success: function (data) {
      oid = data.oid;
      for (var i = 1; i < 3; i++) {
        searchProduct(i, oid);
      }
    },
    error: function (xhr, status, error) {
      alert("error");
    },
  });
}

function searchProduct(i, oid) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/products/" + $("#pid" + i).val(),
    dataType: "JSON",
    async: false,
    success: function (data) {
      var pid = data.pid;
      var pName = data.productName;
      var price = data.price;
      var quantity = $("#quantity" + i).val();
      console.log(price + " " + quantity);
      var total = parseFloat(price) * parseFloat(quantity);
      var data = {
        oid: oid,
        pid: pid,
        pName: pName,
        quantity: quantity,
        total: total,
      };
      addOrderDetail(data);
    },
    error: function () {
      alert("error");
    },
  });
}

function addOrderDetail(data) {
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/order-item",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data) {
      alert("order item placed");
    },
    error: function (xhr, status, error) {
      alert("error");
    },
  });
}

function getCustomer(data, i) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/customers/" + data,
    dataType: "JSON",
    success: function (data1) {
      $("#name" + i).html(data1.name);
      return data1.name;
    },
    error: function () {
      alert("lol");
    },
  });
}

function drawChart(dPoints) {
  dataPoints = [];
  for (var key in dPoints) {
    dataPoints.push({
      y: dPoints[key],
      label: key,
    });
  }
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Categories-wise sale",
      horizontalAlign: "left",
    },
    data: [
      {
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: dataPoints,
      },
    ],
  });
  chart.render();
}
