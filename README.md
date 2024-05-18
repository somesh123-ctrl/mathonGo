Sure, here's a basic README.md file for your GitHub repository:

```
# MathonGo

MathonGo is a web application built with Node.js, Express.js, and MongoDB that allows users to manage lists and send emails to users within those lists.

## Features

- Create lists with custom properties.
- Upload a CSV file to add users to a list.
- Send emails to users within a list with customizable subject and body.
- Unsubscribe users from the application.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/somesh123-ctrl/mathonGo
   ```

2. Navigate into the project directory:

   ```
   cd mathonGo
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:
   
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.your-mongodb-uri/MathonGo
   GMAIL_USER=demo1email2for3project@gmail.com
   GMAIL_PASS=hpaa abyu tssh axvf
   ```

   Replace `your-username`, `your-password`, and `your-mongodb-uri` with your actual MongoDB credentials and URI.

5. Start the server:

   ```
   npm start
   ```

6. The application should now be running on `http://localhost:3000`.

## Usage

### API Endpoints

- `POST /lists`: Create a new list.
- `POST /lists/:id/users`: Add users to a list by uploading a CSV file.
- `POST /lists/:id/send-email`: Send an email to all users in a list.
- `POST /unsubscribe`: Unsubscribe a user from the application.

Refer to the API documentation for detailed information on each endpoint.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
```

Make sure to replace placeholders like `your-username`, `your-password`, and `your-mongodb-uri` with actual values relevant to your project. Additionally, adjust the instructions and descriptions as needed to accurately reflect your application.
