export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

export const signUp = async (userData) => {
  try {
    const { email, password, name, phone } = userData;

    if (
      !email?.trim() ||
      !password?.trim() ||
      !name?.trim() ||
      !phone?.trim()
    ) {
      throw new AuthError("All fields are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthError("Please enter a valid email address", 400);
    }

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
      throw new AuthError(
        data.message || "An unexpected error occurred during signup.",
        response.status
      );
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
    console.log('Attempting login...'); // Debug log
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await response.json();
    console.log('Login response:', response.status, data); // Debug log

    if (!response.ok) {
      throw new AuthError(
        data.message || data.error || "An unexpected error occurred during login",
        response.status
      );
    }

    return {
      success: true,
      data: {
        email: data.email,
        role: data.role,
      },
      redirectPath: data.role === "ADMIN" ? "/admin" : "/home",
    };
  } catch (error) {
    console.error('Login error:', error); // Debug log
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      error.message || "An unexpected error occurred. Please try again later.",
      error.status || 500
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
      throw new AuthError(
        `Failed to logout: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("An unexpected error occurred during logout", 500);
  }
};
