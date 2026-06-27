class Validation {
  checkEmpty(value, errorId, message) {
    const error = document.getElementById(errorId);

    if (value.trim() === "") {
      error.innerHTML = message;
      error.classList.remove("hidden");
      return false;
    }

    error.innerHTML = "";
    error.classList.add("hidden");
    return true;
  }

  checkPrice(value, errorId, message) {
    const error = document.getElementById(errorId);

    if (isNaN(value) || Number(value) <= 0) {
      error.innerHTML = message;
      error.classList.remove("hidden");
      return false;
    }

    error.innerHTML = "";
    error.classList.add("hidden");
    return true;
  }

  checkImageUrl(value, errorId, message) {
    const error = document.getElementById(errorId);

    const regex =
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;

    if (!regex.test(value)) {
      error.innerHTML = message;
      error.classList.remove("hidden");
      return false;
    }

    error.innerHTML = "";
    error.classList.add("hidden");
    return true;
  }

  checkSelect(value, errorId, message) {
    const error = document.getElementById(errorId);

    if (value === "") {
      error.innerHTML = message;
      error.classList.remove("hidden");
      return false;
    }

    error.innerHTML = "";
    error.classList.add("hidden");
    return true;
  }
}

export default Validation;