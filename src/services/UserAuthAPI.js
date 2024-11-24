export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

export const signUp = async (userData) => {
  try {
    // Input validation
    const { email, password, name, phone } = userData;

    if (
      !email?.trim() ||
      !password?.trim() ||
      !name?.trim() ||
      !phone?.trim()
    ) {
      throw new AuthError("All fields are required", 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthError("Please enter a valid email address", 400);
    }

    // Password validation
    if (password.length < 6) {
      throw new AuthError("Password must be at least 6 characters long", 400);
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new AuthError(
            data.message || "Access forbidden. Please check your credentials.",
            403
          );
        case 409:
          throw new AuthError(
            "An account with this email already exists.",
            409
          );
        case 422:
          throw new AuthError(
            data.message || "Invalid input data provided.",
            422
          );
        default:
          throw new AuthError(
            "An unexpected error occurred during signup.",
            response.status
          );
      }
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new AuthError(
        "Unable to connect to the server. Please check your internet connection.",
        0
      );
    }
    throw new AuthError(
      "An unexpected error occurred. Please try again later.",
      500
    );
  }
};

export const logIn = async (credentials) => {
  try {
    // Input validation
    const { email, password } = credentials;

    if (!email?.trim() || !password?.trim()) {
      throw new AuthError("Email and password are required", 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthError("Please enter a valid email address", 400);
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new AuthError("Invalid email or password", 401);
        case 403:
          throw new AuthError(data.message || "Access forbidden", 403);
        case 422:
          throw new AuthError(
            data.message || "Invalid input data provided",
            422
          );
        default:
          throw new AuthError(
            "An unexpected error occurred during login",
            response.status
          );
      }
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        email: data.email,
        role: data.role,
      })
    );

    return {
      success: true,
      data,
      redirectPath: data.role === "ADMIN" ? "/admin" : "/home",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new AuthError(
        "Unable to connect to the server. Please check your internet connection.",
        0
      );
    }
    throw new AuthError(
      "An unexpected error occurred. Please try again later.",
      500
    );
  }
};

export const logOut = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new AuthError("Failed to logout", response.status);
    }

    localStorage.removeItem("user");
    
    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("An unexpected error occurred during logout", 500);
  }
};
