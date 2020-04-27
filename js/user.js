$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/customers",
    dataType: "JSON",
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        $("#custTable tr:last").after(
          "<tr>" +
            "<td>" +
            data[i].cid +
            "</td>" +
            "<td>" +
            data[i].name +
            "</td>" +
            "<td>" +
            data[i].email +
            "</td>" +
            "<td>" +
            data[i].address +
            "</td>" +
            "<td>" +
            data[i].phone +
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

function addNewCustomer() {
  var data = {
    name: $("#inputName").val(),
    email: $("#inputEmail").val(),
    address: $("#inputAddress").val(),
    phone: $("#inputPhone").val(),
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/customers",
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
