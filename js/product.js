$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/categories",
    dataType: "JSON",
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        $("#categories").append(
          "<h3 style='text-align:center'>" +
            data[i].categoryName +
            " ( ID: " +
            data[i].cid +
            " )</h3>"
        );
        cid = data[i].cid;
        // getProducts(data[i].cid);
        $.ajax({
          type: "GET",
          url: "http://localhost:8080/products/category/" + cid,
          dataType: "JSON",
          async: false,
          success: function (data) {
            var str = "";
            if (data.length > 0) {
              str =
                "<table class='table'><thead class='thead-dark'>" +
                "<tr>" +
                "<th scope='col'>Name</th>" +
                "<th scope='col'>ID</th>" +
                "<th scope='col'>Brand</th>" +
                "<th scope='col'>Description</th>" +
                "<th scope='col'>Price</th>" +
                "</tr>" +
                "</thead>";
            }
            for (var i = 0; i < data.length; i++) {
              str +=
                "<tbody>" +
                "<td>" +
                data[i].productName +
                "</td>" +
                "<td>" +
                data[i].pid +
                "</td>" +
                "<td>" +
                data[i].brand +
                "</td>" +
                "<td>" +
                data[i].description +
                "</td>" +
                "<td>" +
                data[i].price +
                "</td>";
            }
            if (data.length > 0) {
              str += "</tbody></table>";

              $("#categories").append(str);
            }
          },
          error: function (e) {
            console.log("err in getprod " + e);
            alert("lol");
          },
        });
      }
    },
    error: function (e) {
      console.log(e);
    },
  });
});
function getProducts(cid) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/products/category/" + cid,
    dataType: "JSON",
    success: function (data) {
      var str = "";
      if (data.length > 0) {
        str =
          "<table class='table'><thead class='thead-dark'>" +
          "<tr>" +
          "<th scope='col'>Name</th>" +
          "<th scope='col'>Brand</th>" +
          "<th scope='col'>Description</th>" +
          "<th scope='col'>Price</th>" +
          "</tr>" +
          "</thead>";
      }
      for (var i = 0; i < data.length; i++) {
        str +=
          "<tbody>" +
          "<td>" +
          data[i].productName +
          "</td>" +
          "<td>" +
          data[i].brand +
          "</td>" +
          "<td>" +
          data[i].description +
          "</td>" +
          "<td>" +
          data[i].price +
          "</td>";
      }
      if (data.length > 0) {
        str += "</tbody></table>";

        $("#categories").append(str);
      }
    },
    error: function (e) {
      alert("lol");
    },
  });
}

function addProduct() {
  alert("add product called");
  var data = {
    cid: $("#inputCategory").val(),
    productName: $("#inputName").val(),
    brand: $("#inputBrand").val(),
    description: $("#inputDesc").val(),
    price: $("#inputPrice").val(),
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/products",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data) {
      alert("success");
    },
    error: function (xhr, status, error) {
      //   alert(
      //     $("#inputName").val() +
      //       $("#inputAddress").val() +
      //       $("#inputPhone").val() +
      //       " in err " +
      //       xhr.responseText
      //   );
      alert("lol");
      var err = JSON.parse(xhr.responseText);
      alert(err.Message + " lola");
    },
  });
}
function addCategory() {
  var data = {
    categoryName: $("#inputName1").val(),
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/categories",
    dataType: "JSON",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data) {
      alert("success");
    },
    error: function (xhr, status, error) {
      //   alert(
      //     $("#inputName").val() +
      //       $("#inputAddress").val() +
      //       $("#inputPhone").val() +
      //       " in err " +
      //       xhr.responseText
      //   );
      alert("lol");
      var err = JSON.parse(xhr.responseText);
      alert(err.Message + " lola");
    },
  });
}
