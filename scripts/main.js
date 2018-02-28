var coffeeOrders = []
var form = document.querySelector('[data-coffee-order="form"]');
var successIcon = document.querySelector('.circle');
var panelBody = document.querySelectorAll('.panel-body');
var priorOrderPanel = panelBody[1]
var modal = document.querySelector('.modal');
var completedButton = document.querySelector('.confirm')
var notCompletedButton = document.querySelector('.deny')
var orderCompleted = function (event) {
  var removeOrder = function (event) {
    var orderToBeDeleted = activeCheckbox.closest('.order');
    console.log(orderToBeDeleted);
    var orderToBeDeletedParent = orderToBeDeleted.closest('.panel-body');
    var totalOrders = orderToBeDeletedParent.querySelectorAll('.order');
    totalOrders.forEach(function(element, i){
      if (element === orderToBeDeleted) {
        coffeeOrders.splice(i, 1);
      }
    })
    orderToBeDeletedParent.removeChild(orderToBeDeleted);
    toggleModal();
    savedData();
  }
  if (this.checked) {
    toggleModal();
    var activeCheckbox = event.target;
    console.log(activeCheckbox);
    completedButton.addEventListener('click', removeOrder);
    notCompletedButton.addEventListener('click', toggleModal);
    var checkboxes = document.querySelectorAll('[type=checkbox]');
    for (i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  }
}

var renderOrder = function() {
  var priorOrderHeader = document.createElement('h5');
  var orderCheckbox = document.createElement('input');
  orderCheckbox.setAttribute('type', 'checkbox');
  orderCheckbox.addEventListener('change', orderCompleted);
  priorOrderHeader.textContent = 'Order: ' + coffeeOrders.length;
  var orderWrapper = document.createElement('div');
  orderWrapper.classList.add('order')
  var orderCompleter = document.createElement('div');
  orderCompleter.classList.add('orderCheckedWrapper')
  orderWrapper.appendChild(orderCompleter);
  priorOrderPanel.appendChild(orderWrapper);
  console.log(priorOrderPanel.querySelectorAll('.orderCheckedWrapper'));
  console.log(coffeeOrders.length - 1);
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[coffeeOrders.length - 1].appendChild(orderCheckbox);
  priorOrderPanel.querySelectorAll('.orderCheckedWrapper')[coffeeOrders.length - 1].appendChild(priorOrderHeader);
  priorOrderPanel.querySelectorAll('.order')[coffeeOrders.length - 1].appendChild(document.createElement('ul'));
  for (var property in newOrder) {
    var priorOrderStat = document.createElement('li');
    priorOrderStat.textContent = property + ': ' + newOrder[property];
    document.querySelectorAll('ul')[coffeeOrders.length - 1].appendChild(priorOrderStat);
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
  renderOrder()
  saveData();
  form.reset();
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
coffeeOrders = loadedData;
