import { withRouter } from "next/router";
import React from "react";
import Cookies from 'js-cookie'

const withAuth = (Component = null, options = {}) => {
    class WithAuthComponent extends React.Component {
        state = {
            pageLoading: true,
            redirectIfNotAuthenticated: options.redirectIfNotAuthenticated ?? "/login",
            redirectIfAuthenticated: options.redirectIfAuthenticated ?? "/",
        };

        componentDidMount() {
            // Check both cookies and localStorage for authentication data
            const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
            const userCookie = Cookies.get('user') || (typeof window !== 'undefined' ? localStorage.getItem('user') : null);
            const user = userCookie ? JSON.parse(userCookie) : null;
            const role = Cookies.get('role') || (typeof window !== 'undefined' ? localStorage.getItem('role') : null);

            // Route is protected but not authenticated. So redirect to login page
            if (options.isProtectedRoute && !token) {
                this.props.router.replace(this.state.redirectIfNotAuthenticated);
                return null;
            }

            // Route is not protected but authenticated. So redirect to Dashboard or provided url
            if (!options.isProtectedRoute && token) {
                this.props.router.replace(this.state.redirectIfAuthenticated);
                return null;
            }

            // Check if user has expired status and unpaid payment
            if(!options.show && user?.status === 'expired' && user?.payment_status === 'unpaid' && token) {
                this.props.router.replace('/subscription');
                return null;
            }

            // Check if route requires admin role
            if (options.requireAdmin && role !== 'admin') {
                // Redirect non-admin users to dashboard or show access denied
                this.props.router.replace('/');
                return null;
            }

            this.setState({ pageLoading: false });
        }

        render() {
            const { pageLoading } = this.state;

            if (pageLoading) {
                return "";
            }
            return <Component {...this.props} />;
        }
    }

    return withRouter(WithAuthComponent);
};

export default withAuth;