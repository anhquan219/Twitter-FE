# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Luồng chạy Ứng dụng Login with Google

### Phía FE

- FE khởi tạo 1 đường đẫn URL theo hướng dẫn của Google API để truy cập đến Google Login (Giao diện đăng nhập Google)
- Khi click button chứa đường link này sẽ mở ra cửa sổ đăng nhập Google
- Khi đăng nhập thành công sẽ gọi đến BE URL "redirect_uri" đã setup trong đường dẫn URL trên
  ("http://localhost:4000/users/oauth/google")

### Phía BE

- BE nhận được request URL và xử lý trong oauthController
- Lấy ra "code" trong req.query (Do Google API trả về)
- Lấy "id_token", "access_token dựa vào "code"
- Lấy userInfo dựa vào "id_token", "access_token"
- Sau khi có được userInfo Google tiến hành đăng nhập hoặc đăng kí
- Sau đó trả về "access_token", "refresh_token" về cliend thông qua res.redirect(URL),
  (Với URL chứa các thông tin cần truyền về Cliend)

  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}?new_user=${result.newUser}?verify=${result.verify}`

  > res.redirect(urlRedirect)
