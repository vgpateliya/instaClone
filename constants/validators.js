module.exports = {
  emailValidator: {
    Syntex:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    Message: "Please Enter Valid Email Address!",
  },
  passwordValidator: {
    Syntex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    Message:
      "Password Must Contain Minimum Eight Characters With At Least One Uppercase Letter, One Lowercase Letter, One Number And One Special Character!",
  },
};
