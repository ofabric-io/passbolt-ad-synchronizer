# Passbolt AD Synchronizer

Passbolt AD Synchronizer is a TypeScript-based application designed to synchronize Active Directory (AD) groups with the community version of Passbolt. The primary functionality includes watching AD for groups with the prefix "PASSBOLT_" and creating/maintaining those groups in Passbolt. Additionally, the application automates the process of inviting new users associated with any of the "PASSBOLT_" groups in AD.

## Features

- **Group Synchronization:** Automatically detects and creates/maintains Passbolt groups for AD groups with the prefix "PASSBOLT_".
- **User Invitation:** Sends Passbolt invites to new users associated with "PASSBOLT_" groups in AD.
- **Cronjob Tasks:** Scheduled tasks for regular synchronization and maintenance.
  - **User Sync Task:** Runs every minute (`* * * * *`).
  - **Group Creator Task:** Runs every 6 minutes (`*/6 * * * *`).
  - **Group Sync Task:** Runs every 4 minutes (`*/4 * * * *`).

## Prerequisites

Before running the application, ensure you have the following environment variables set:

- `PASSBOLT_SERVER_ADDRESS`: Passbolt server address.
- `PASSBOLT_USER_ID`: Passbolt user ID. Ex: (`c4d7f33bbc3a-893e-4da6-90e0-893e4da6`): 
- `PASSBOLT_USER_PASSWORD`: Passbolt user password.
- `PASSBOLT_USER_PRIVATEKEY_B64`: Passbolt user private key (base64 encoded).
- `MICROSOFT_TENANT_ID`: Microsoft Azure AD tenant ID.
- `MICROSOFT_CLIENT_ID`: Microsoft Azure AD client ID.
- `MICROSOFT_CLIENT_SECRET`: Microsoft Azure AD client secret.

## Technologies Used

- **Passbolt Integration:** Built on top of the [go-passbolt-cli](https://github.com/passbolt/go-passbolt-cli) project.
- **AD Integration:** Utilizes the [@microsoft/microsoft-graph-client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client) library.
- **Language:** TypeScript

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/ofabric-io/passbolt-ad-synchronizer.git
    ```

2. Install dependencies:

    ```bash
    cd passbolt-ad-synchronizer
    npm install
    ```

3. Set up environment variables (as mentioned in Prerequisites).

4. Run the application:

    ```bash
    npm start:dev
    ```

## Docker

The official Docker image of the application is available [here](https://hub.docker.com/repository/docker/0fabricio/passbolt-ad-synchronizer/general).

```bash
docker run -e PASSBOLT_SERVER_ADDRESS=... -e PASSBOLT_USER_ID=... -e PASSBOLT_USER_PASSWORD=... -e PASSBOLT_USER_PRIVATEKEY_B64=... -e MICROSOFT_TENANT_ID=... -e MICROSOFT_CLIENT_ID=... -e MICROSOFT_CLIENT_SECRET=... 0fabricio/passbolt-ad-synchronizer
```

## Contributing

Contributions are welcome! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).