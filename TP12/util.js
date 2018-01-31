module.exports = function util(str) {
  return {
    checkString: function (str) {
      return typeof str === 'string';
    }
  }
};
