/**
 * Trả về đường dẫn mặc định sau khi đăng nhập theo role
 */
export function getDefaultPathByRole(role) {
  switch (role) {
    case 'Admin':
      return '/admin/dashboard';
    case 'Marketing':
      return '/marketing/dashboard';
    case 'Sale':
      return '/sale/dashboard';
    case 'Expert':
      return '/expert/subjects';
    case 'Customer':
    default:
      return '/customer/practices';
  }
}

/**
 * Trả về đường dẫn Trang chủ theo role (mỗi actor có trang chủ riêng)
 */
export function getHomePathByRole(role) {
  switch (role) {
    case 'Admin':
      return '/admin/dashboard';
    case 'Marketing':
      return '/marketing/dashboard';
    case 'Sale':
      return '/sale/dashboard';
    case 'Expert':
      return '/expert/subjects';
    case 'Customer':
    default:
      return '/home';
  }
}
