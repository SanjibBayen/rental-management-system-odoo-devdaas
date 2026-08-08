export async function sendEmail(to: string, subject: string, _html: string) {
  console.log(`sendEmail to=${to} subject=${subject}`);
  return Promise.resolve(true);
}

export default sendEmail;
