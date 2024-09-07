import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 * 
 * Static class tying together methods to fetch or send to backend API
 * to separate backend logic.
 */
class PromaApi {
    // Store the token for interacting with the API.
    static token;

    // Define a reusable request method
    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${PromaApi.token}` };
        const params = (method === 'get')
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch(err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Get token and user for login from username and password. */
    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res;
    }

    /** Get token and user via signing up for proma */
    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res;
    }

    /** Get user data object */
    static async getUser(id) {
        let res = await this.request(`users/${id}`);
        return res.user;
    }

    /** Get list of Categories with name and ID */
    static async getCategories() {
        let res = await this.request(`categories`);
        return res.categories;
    }

    /** Get list of user's boards */
    static async getBoards() {
        let res = await this.request(`boards`);
        return res.boards;
    }

    /** Create a board from data */
    static async createBoard(data) {
        let res = await this.request(`boards`, data, "post");
        return res;
    }

    /** Get board data by ID */
    static async getBoard(boardId) {
        let res = await this.request(`boards/${boardId}`);
        return res;
    }

    /** Get all users on a board by ID */
    static async getBoardUsers(boardId) {
        let res = await this.request(`boards/${boardId}/users`);
        return res;
    }

    /** Get all projects on a board by ID */
    static async getBoardProjects(boardId) {
        let res = await this.request(`boards/${boardId}/projects`);
        return res;
    }

    /** Get all users on a project by project ID */
    static async getProjectUsers(projectId) {
        let res = await this.request(`projects/${projectId}/users`);
        return res;
    }

    /** Get a user by email */
    static async getByEmail(email) {
        let res = await this.request(`users/search`, { email });
        return res;
    }

    /** Add user to a board by userId, boardId */
    static async addUserToBoard(boardId, userId) {
        let res = await this.request(`boards/${boardId}/users`, { userId }, "post");
        return res;
    }

    /** Create project */
    static async createProject(boardId, name, priority, stage) {
        let res = await this.request(`boards/${boardId}/projects`, { name, priority, stage }, "post");
        return res;
    }

    /** Add user to a project */
    static async addUserToProject(projectId, userId) {
        let res = await this.request(`projects/${projectId}/users`, { userId }, "post");
        return res;
    }

    /** Create session */
    static async createSession(projectId, userId, categoryId) {
        let res = await this.request(`projects/${projectId}/sessions`, { userId, categoryId }, "post");
        return res;
    }

    /** Update session */
    static async updateSession(sessionId, { endDatetime, comment }) {
        let res = await this.request(`sessions/${sessionId}`, { endDatetime, comment }, "patch");
        return res;
    }

    /** Get a session by ID */
    static async getSession(sessionId) {
        let res = await this.request(`sessions/${sessionId}`);
        return res;
    }

    /** Get all user projects */
    static async getUserProjects() {
        let res = await this.request(`projects`);
        return res;
    }

    /** Update a project's stage */
    static async updateProjectStage(projectId, stage) {
        let res = await this.request(`projects/${projectId}`, { stage }, "patch");
        return res;
    }

    /** Get all user sessions */
    static async getSessions() {
        let res = await this.request(`sessions`);
        return res;
    }

    /** Get all users on boards with user to use as ID key */
    static async getUsers() {
        let res = await this.request(`users`);
        return res;
    }

}

export default PromaApi;