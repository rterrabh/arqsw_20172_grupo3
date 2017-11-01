
API.fetchUser.then(function(user) {
  user.fetchAddress().then(function(address) {
    console.log(address);
  });
});

API.fetchUser.then(function(user) {
  return user.fetch();
}).then(function(address) {
  console.log(address);
});

API.fetchUser.then(function(user) {
  fetchAddress.then(function(address) {
    fetchCEP.then(function(zip) { });
  });
});

// Verify then even if it's at the tip of the chain
API.fetchUser.then(function(user) {
  user.fetchItems.then();
});
