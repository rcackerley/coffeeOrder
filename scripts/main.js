var coffeeOrders = []
var form = document.querySelector('[data-coffee-order="form"]');
var successIcon = document.querySelector('.circle');
var panelBody = document.querySelectorAll('.panel-body');
var priorOrderPanel = panelBody[1]
var modal = document.querySelector('.modal');
var completedButton = document.querySelector('.confirm')
var notCompletedButton = document.querySelector('.deny')
var orderCompleted = function (event) {
  var activeCheckbox = event.target;
  var removeOrder = function (event) {
    var orderToBeDeleted = activeCheckbox.closest('.order');
    console.log(orderToBeDeleted);
    var orderToBeDeletedParent = orderToBeDeleted.closest('.panel-body');
    console.log(orderToBeDeletedParent);
    var totalOrders = orderToBeDeletedParent.querySelectorAll('.order');
    totalOrders.forEach(function(element, i){
      if (element === orderToBeDeleted) {
        coffeeOrders.splice(i, 1);
      }
    })
    orderToBeDeletedParent.removeChild(orderToBeDeleted);
    toggleModal();
    saveData();
  }
  if (this.checked) {
    toggleModal();
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
    email: form.emailAddress.value,
    size: form.size.value,
    flavor: form.flavor.value,
    strength: form.strength.value,
  };
  coffeeOrders.push(newOrder);
  // successIcon.classList.toggle('hidden');
  renderOrder(newOrder);
  saveData();
  form.reset();
}

var renderOrder = function(newOrder) {
  var orderWrapper = document.createElement('div');
  var orderCompleter = document.createElement('div');
  var priorOrderHeader = document.createElement('h5');
  var orderCheckbox = document.createElement('input');
  orderCheckbox.setAttribute('type', 'checkbox');
  orderCheckbox.addEventListener('change', orderCompleted);
  priorOrderHeader.textContent = 'Order: ' + coffeeOrders.length;
  orderWrapper.classList.add('order')
  orderCompleter.classList.add('orderCheckedWrapper')
  orderCompleter.setAttribute('data-id', coffeeOrders.length - 1);
  orderWrapper.appendChild(orderCompleter);
  priorOrderPanel.appendChild(orderWrapper);
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[orderCompleter.getAttribute('data-id')].appendChild(orderCheckbox);
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[coffeeOrders.length - 1].appendChild(priorOrderHeader);
  priorOrderPanel.querySelectorAll('.order')[coffeeOrders.length - 1].appendChild(document.createElement('ul'));
  for (var property in newOrder) {
    var priorOrderStat = document.createElement('li');
    priorOrderStat.textContent = property + ': ' + newOrder[property];
    document.querySelectorAll('ul')[coffeeOrders.length - 1].appendChild(priorOrderStat);
  }
}

var toggleModal = function() {
  modal.classList.toggle('hidden');
}

var saveData = function() {
  var data = JSON.stringify(coffeeOrders);
  localStorage.setItem('orders', data);
}


form.addEventListener('submit', formSubmission);
var loadedData = JSON.parse(localStorage.getItem('orders'));
if (loadedData != null) {
    coffeeOrders = loadedData;
    for (var i = 0; i < coffeeOrders.length; i++) {
      console.log(coffeeOrders[i]);
      renderOrder(coffeeOrders[i]);
    }
}
