exports.getEmailTemplate = (body, user) => {
  let emailBody = body;
  for (const [key, value] of user.properties.entries()) {
    const placeholder = `[${key}]`;
    emailBody = emailBody.replace(new RegExp(placeholder, "g"), value);
  }
  emailBody = emailBody
    .replace(/\[name\]/g, user.name)
    .replace(/\[email\]/g, user.email);
  return (
    emailBody +
    `<br><br><a href="http://yourdomain.com/unsubscribe/${user.listId}/${user._id}">Unsubscribe</a>`
  );
};
