# ILBANK Technical Support Guideline Web Application

## Description

The ILBANK Technical Support Guideline is a web application that provides a user-friendly interface for the technical support team to manage the guidelines about the programs that are used by the bank employees, managers, chairman and above. The application is developed using [Next.js, a React framework](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).

## Features

There is an admin panel for the authorized users to manage the programs, users, directorates and departments. The admin panel is accessible via the `/admin` route. The admin panel has the following features:

-   **Programs**: The admin can add, edit and delete programs. The programs can be filtered by the directorate and department.
-   **Users**: The admin can add new authorized users to the system.
-   **Directorates**: The admin can add, edit and delete directorates.
-   **Departments**: The admin can add, edit and delete departments.

## Installation

To install the project, you will need to have the following tools installed on your system:

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)

First, clone the repository to your local system:

```bash
git clone https://github.com/axelnt/ilbank-tg-web.git
```

Then, navigate to the project directory:

```bash
cd ilbank-tg-web
```

Install the dependencies:

```bash
npm install
```

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `NEXT_PUBLIC_API_URL` in the `.env` file to point to the API server:

```bash
NEXT_PUBLIC_API_URL=https://IP_OF_THE_SERVER/tg/api
```

    You can get the API server from the [ILBANK Technical Support Guideline API](
        https://github.com/axelnt/ilbank-tg-api.git) repository.

Then, you will be able to start the development server with the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build the project for production, you can run the following command:

```bash
npm run build
```

After building the project, you can start the production server with the following command:

```bash
npm run start
```

## License

Check the [LICENSE](LICENSE) file for the license information.
