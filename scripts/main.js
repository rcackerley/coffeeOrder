
var coffeeOrders = []
var form = document.querySelector('[data-coffee-order="form"]');
var successIcon = document.querySelector('.circle');
var panelBody = document.querySelectorAll('.panel-body');
var priorOrderPanel = panelBody[1]
var modal = document.querySelector('.modal');
var completedButton = document.querySelector('.confirm')
var notCompletedButton = document.querySelector('.deny')

//function to remove an order after it has been completed
var orderCompleted = function (event) {
  var activeCheckbox = event.target;
  var removeOrder = function (event) {
    event.preventDefault();
    var orderToBeDeleted = activeCheckbox.closest('.order');
    var idForDeletion = orderToBeDeleted.querySelector('.orderCheckedWrapper').getAttribute('data-id');
    var emailForDeletion = coffeeOrders[idForDeletion].emailAddress;
    console.log(emailForDeletion);
    // console.log(orderToBeDeleted);
    var orderToBeDeletedParent = orderToBeDeleted.closest('.panel-body');
    // console.log(orderToBeDeletedParent);
    var totalOrders = orderToBeDeletedParent.querySelectorAll('.order');
    totalOrders.forEach(function(element, i){
      if (element === orderToBeDeleted) {
        coffeeOrders.splice(i, 1);
      }
    });
    console.log(orderToBeDeleted);
    orderToBeDeleted.classList.add('green-bg');
    setTimeout(function() {orderToBeDeletedParent.removeChild(orderToBeDeleted)}, 2000);
    toggleModal(event);
    deleteData(emailForDeletion);
  }
  if (this.checked) {
    toggleModal(event);
    completedButton.addEventListener('click', removeOrder);
    notCompletedButton.addEventListener('click', toggleModal);
    var checkboxes = document.querySelectorAll('[type=checkbox]');
    for (i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  }
}

var formSubmission = function() {
  event.preventDefault();
  var newOrder = {
    coffee: form.coffee.value,
    emailAddress: form.emailAddress.value,
    size: form.size.value,
    flavor: form.flavor.value,
    strength: form.strength.value,
  };
  coffeeOrders.push(newOrder);
  // successIcon.classList.toggle('hidden');
  renderOrder(newOrder, coffeeOrders.length - 1);
  saveData(newOrder);
  form.reset();
}

var renderOrder = function(newOrder, iterator) {
  var orderWrapper = document.createElement('div');
  var orderCompleter = document.createElement('div');
  var priorOrderHeader = document.createElement('h5');
  var orderCheckbox = document.createElement('input');
  var unorderedList = document.createElement('ul');
  orderCheckbox.setAttribute('type', 'checkbox');
  orderCheckbox.addEventListener('change', orderCompleted);
  priorOrderHeader.textContent = 'Order: ' + (iterator + 1);
  orderWrapper.classList.add('order')
  orderCompleter.classList.add('orderCheckedWrapper')
  orderCompleter.setAttribute('data-id', iterator);
  orderWrapper.appendChild(orderCompleter);
  priorOrderPanel.appendChild(orderWrapper);
  // console.log(priorOrderPanel.querySelectorAll('.orderCheckedWrapper'));
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[iterator].appendChild(orderCheckbox);
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[iterator].appendChild(priorOrderHeader);
  priorOrderPanel.querySelectorAll('.order')[iterator].appendChild(unorderedList);


  var sortOrder =  Object.keys(newOrder);
  sortOrder = sortOrder.sort();
  //Filtering out unwanted data for render and rendering <li> in alphabetical order
  sortOrder.forEach( function(element) {
    for (var property in newOrder) {
      if (property !== '_id' && property !== '__v') {
        if (element === property) {
          if (property === 'emailAddress') {
            var priorOrderStat = document.createElement('li');
            priorOrderStat.textContent = 'email' + ': ' + newOrder[property];
            document.querySelectorAll('ul')[iterator].appendChild(priorOrderStat);
          } else {
            var priorOrderStat = document.createElement('li');
            priorOrderStat.textContent = property + ': ' + newOrder[property];
            document.querySelectorAll('ul')[iterator].appendChild(priorOrderStat);
          }
        }
      }
    }
  })
}

var toggleModal = function(event) {
  event.preventDefault();
  modal.classList.toggle('hidden');
}

var deleteData = function(email) {
  $.ajax({
    url: 'http://dc-coffeerun.herokuapp.com/api/coffeeorders/' + email,
    type: 'DELETE',
  });
}

var saveData = function(newOrder) {
    newOrder.strength = Number(newOrder.strength);
  $.post('http://dc-coffeerun.herokuapp.com/api/coffeeorders', newOrder, function() {
    console.log(newOrder);
  });
}

var sortObject = function(a,b) {

}


form.addEventListener('submit', formSubmission);
var orderObjectToBeParsed
var loadedData = $.get('http://dc-coffeerun.herokuapp.com/api/coffeeorders', function(data) {
  orderObjectToBeParsed = data;
  for (var order1 in orderObjectToBeParsed) {
    coffeeOrders.push(orderObjectToBeParsed[order1]);
  };
  if (coffeeOrders.length > 0) {
      for (var i = 0; i < coffeeOrders.length; i++) {
        renderOrder(coffeeOrders[i], i);
      }
  }
});
