angular.module('myApp', [])
.controller('CartController', function ($scope) {
    var savedCart = localStorage.getItem('kaplan_cart');
    $scope.defaultItems = savedCart ? JSON.parse(savedCart) : getDefaultItems();
    
    $scope.disableUndo = true;
    $scope.disableRedo = true;


    // maintains a stack for undo and redo
    var undoStack = [];
    var redoStack = [];

    // function to get the default books
    function getDefaultItems() {
        return [
            {title: 'Surf Shorts', qty: 1, price: 49.99},
            {title: 'Tank Top', qty: 2, price: 27.95},
            {title: 'T-Shirt', qty: 1, price: 29.95},
            {title: 'Hoodie', qty: 1, price: 57.95},
            {title: 'Waterproof Cap', qty: 1, price: 17.95},
            {title: 'Sunglasses', qty: 3, price: 27.89}
        ];
    }

    // functions to check if undo/redo buttons need to be disabled
    function checkUndo() {
        if (undoStack.length > 0) {
            $scope.disableUndo = false;
        }
    }

    function checkRedo() {
        if (redoStack.length <= 0) {
            $scope.disableRedo = true;
        } else if (redoStack.length > 0) {
            $scope.disableRedo = false;
        }
    }


    // function to save the current cart 
    function saveState() {
        undoStack.push(angular.copy($scope.defaultItems));
        redoStack = []; // clears redo stack when a new state is saved
        checkUndo();
    }

    $scope.saveItems = function() {
        localStorage.setItem('kaplan_cart', JSON.stringify($scope.defaultItems));
    }

    $scope.removeItem = function(index) {
        saveState();
        $scope.defaultItems.splice(index, 1);
    }

    $scope.addItem = function() {
        saveState();
        var newItem = { title: 'New Item', qty: 1, price: 10.99 };
        $scope.defaultItems.push(newItem);
        console.log("undostack length" + undoStack.length);
        checkRedo();
    }

    $scope.undo = function() {
        if (undoStack.length > 0) {
            var prevState = undoStack.pop();
            redoStack.push(angular.copy($scope.defaultItems));
            $scope.defaultItems = prevState;
            checkRedo();
        } 
    }

    $scope.redo = function() {
        if (redoStack.length > 0) {
            var nextState = redoStack.pop();
            undoStack.push(angular.copy($scope.defaultItems));
            $scope.defaultItems = nextState;
        }
        checkRedo();
    }

    $scope.updateTotal = function() {
        if ($scope.defaultItems) {
            var total = 0;
            // calculates the total based on $scope.defaultItems
            for (var i = 0; i < $scope.defaultItems.length; i++) {
                total += $scope.defaultItems[i].qty * $scope.defaultItems[i].price;
            }
            return total.toFixed(2);
        }
        return 0; // returns 0 if $scope.defaultItems is undefined
    }
});
