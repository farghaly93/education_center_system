exports.formatDate = (mills) => {
    const date = new Date(mills);
    const stringDate =
      date.getFullYear() +
      "-" +
      (+date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    return stringDate;
  }