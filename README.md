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

1. First, clone the repository to your local system:

```bash
git clone https://github.com/axelnt/ilbank-tg-web.git
```

2. Then, navigate to the project directory:

```bash
cd ilbank-tg-web
```

3. Install the dependencies:

```bash
npm install
```

4. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

5. Update the `NEXT_PUBLIC_API_URL` in the `.env` file to point to the API server:

```bash
NEXT_PUBLIC_API_URL=https://IP_OF_THE_SERVER/tg/api
```

    You can get the API server from the [ILBANK Technical Support Guideline API](
        https://github.com/KBarisK/TechSupBackend.git) repository.

6.1. Then, you will be able to start the development server with the following command:

```bash
npm run dev
```

Or, you can build the project for production and start the production server:

6.2. To build the project for production, run the following command:

```bash
npm run build
```

6.2.1. After building the project, you can start the production server with the following command:

```bash
npm run start
```

## License

Check the [LICENSE](LICENSE) file for the license information.
