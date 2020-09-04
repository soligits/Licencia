import React, {Fragment, Component} from 'react';
import '../../CSS Designs/MainPage/LoginMenu.css';
import MainTextField from "./mainTextField";
import loginSignUpMethod from '../../Js Functionals/MainPage/Login SignUp Method';
import loginSignUpShow from '../../Js Functionals/MainPage/Login SignUp Show';

class MainLoginMenu extends Component {
    render() {
        return (
            <Fragment className="content Login-SignUp-Menu" id="Login-Menu">
                <div className="ui form formPadding">
                    {/*<div className="ui form formPadding">
                        <div className="ui field">
                            <p className="paragraphInput">نام کاربری یا ایمیل</p>
                            <input maxLength="50" type="text" placeholder="Username Or Email"
                                   id="login-KeyPoint" onFocus="setFieldError(this, false)" />
                        </div>
                    </div>*/}

                    {/*<div className="ui form formPadding">
                        <div className="ui field">
                            <p className="paragraphInput">رمز عبور</p>
                            <input maxLength="30" type="password" className="div-div-div-input" id="login-Password"
                                   placeholder="Password" onFocus="setFieldError(this, false)" />
                        </div>
                    </div>*/}

                    <MainTextField id='login-KeyPoint' maxLength='50' textName='نام کاربری یا ایمیل' placeHolder='Username Or Email' />

                    <MainTextField id='login-Password' maxLength='30' textName='رمز عبور' placeHolder='Password' />

                    <div className="ui form formPadding">
                        <div className="ui field">
                            <p className="paragraphInput">نوع</p>
                            <select className="ui dropdown" id="loginKind">
                                <option value="employer">کارفرما</option>
                                <option value="freelancer">فریلنسر</option>
                            </select>
                        </div>
                    </div>

                    <div className="ui form formPadding" id="Login-Footer-Form">
                        <label>
                            <input onClick="login()" type="submit" id="loginButton" className="ui green button"
                                   value="login" />
                        </label>
                        <footer className="loginFooter">
                            <p className="div-div-footer-p" id="LoginMenu-SignUp-Link">آیا حساب ندارید؟<a
                                className="div-div-footer-signupLink" href="javascript:signUpMenu()">ثبت نام</a></p>
                        </footer>
                    </div>
                </div>

                <script src={loginSignUpMethod}/>
                <script src={loginSignUpShow}/>
            </Fragment>
        );
    }
}

export default MainLoginMenu;
