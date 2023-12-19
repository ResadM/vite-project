import requests from "./axiosInstance";

const Users = {
    getUsersList:(params: URLSearchParams, cancellationToken: any) =>
    requests.get("user", params, cancellationToken),
}

export default Users;