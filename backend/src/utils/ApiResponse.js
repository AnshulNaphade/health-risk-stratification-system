export class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    })
  }

  static created(res, data, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201)
  }
}