import React from 'react';

const ForgetPassword = () => {
  return (
    <div className="sign-in p-4">
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <span className="mdi mdi-account-lock-outline display-1 text-primary"></span>
          <h2 className="my-3 fw-bold">Forget Password</h2>
          <p className="text-muted mb-0">We need your registration email account to send you password reset code!</p>
        </div>
        <a className="toggle bg-white shadow rounded-circle icon d-flex align-items-center justify-content-center fs-5" href="#"><i className="bi bi-list fs-3 d-flex"></i></a>
      </div>
      <form>
        <div className="mb-2">
          <label htmlFor="exampleFormControlEmail" className="form-label mb-1">Email</label>
          <div className="input-group border bg-white rounded-3 py-1" id="exampleFormControlEmail">
            <span className="input-group-text bg-transparent rounded-0 border-0" id="mail">
              <span className="mdi mdi-email-outline mdi-18px text-muted"></span>
            </span>
            <input type="email" className="form-control bg-transparent rounded-0 border-0 px-0"
              placeholder="Type your email or phone" aria-label="Type your email or phone" aria-describedby="mail"
              defaultValue="singh@email.com"> </input>
          </div>
        </div>
      </form>
      <div className="footer fixed-bottom m-4">
        <a href="reset-password.html" className="btn btn-info btn-lg w-100  ">Send</a>
      </div>
    </div>
  );
};

export default ForgetPassword;
