import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ctx from '@/components/context.jsx';
import { login } from '@/api/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const { auth, addToast } = useContext(ctx);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    setServerError('');
    setLoading(true);
    try {
      const json = await login(values);
      const user = json.data || json;
      auth.setUser(user);
      auth.setToken(user.accessToken);
      addToast('Logged in successfully', 'success');
      navigate('/');
    } catch (e) {
      setServerError(e.message);
      addToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
        <label className="form-control">
          <span className="label-text">Email</span>
          <input className="input input-bordered" type="email" placeholder="first.last@stud.noroff.no" {...register('email', { required: 'Email is required' })} />
          {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
        </label>
        <label className="form-control">
          <span className="label-text">Password</span>
          <input className="input input-bordered" type="password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
        </label>
        {serverError && <div className="alert alert-error text-sm" role="alert">{serverError}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link className="link" to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}