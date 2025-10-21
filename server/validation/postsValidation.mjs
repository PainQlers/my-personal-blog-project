export function validateCreatePost(data) {
    const errors = [];
  
    if (!data.title || typeof data.title !== "string") {
      errors.push("title is required and must be a string");
    }
    if (!data.image || typeof data.image !== "string") {
      errors.push("image is required and must be a string");
    }
    if (!data.description || typeof data.description !== "string") {
      errors.push("description is required and must be a string");
    }
    if (!data.content || typeof data.content !== "string") {
      errors.push("content is required and must be a string");
    }
    if (data.category_id === undefined || typeof data.category_id !== "number") {
      errors.push("category_id is required and must be a number");
    }
    if (data.status_id === undefined || typeof data.status_id !== "number") {
      errors.push("status_id is required and must be a number");
    }
  
    return {
      valid: errors.length === 0,
      errors
    };
  }

  export function validateUpdatePost(data) {
    const errors = [];
  
    if (data.title !== undefined && typeof data.title !== "string") {
      errors.push("title must be a string");
    }
    if (data.image !== undefined && typeof data.image !== "string") {
      errors.push("image must be a string");
    }
    if (data.description !== undefined && typeof data.description !== "string") {
      errors.push("description must be a string");
    }
    if (data.content !== undefined && typeof data.content !== "string") {
      errors.push("content must be a string");
    }
    if (data.category_id !== undefined && typeof data.category_id !== "number") {
      errors.push("category_id must be a number");
    }
    if (data.status_id !== undefined && typeof data.status_id !== "number") {
      errors.push("status_id must be a number");
    }
  
    return {
      valid: errors.length === 0,
      errors
    };
  }