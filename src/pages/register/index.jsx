import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ctx from '@/components/context.jsx';
import { register as apiRegister } from '@/api/auth.js';

export default function Register() {
	const navigate = useNavigate();
	const { addToast } = useContext(ctx);
		const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { venueManager: false }
	});
	const [serverError, setServerError] = useState('');
	const [loading, setLoading] = useState(false);

	function isStud(email) {
		return /@stud\.noroff\.no$/i.test(email);
	}

	async function onSubmit(values) {
		setServerError('');
		if (!isStud(values.email)) {
			setServerError('Email must be a valid stud.noroff.no address');
			return;
		}

		setLoading(true);
			try {
			const payload = {
				name: values.name,
				email: values.email,
				password: values.password,
				venueManager: !!values.venueManager
			};
				await apiRegister(payload);
					addToast('Account created. You can now login.', 'success');
					navigate('/login');
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
				<h1 className="text-2xl font-semibold">Register</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
				<label className="form-control">
					<span className="label-text">Username</span>
					<input className="input input-bordered" {...register('name', { required: 'Username is required', pattern: { value: /^[A-Za-z0-9_]+$/, message: 'Only letters, numbers and _ allowed' } })} />
					{errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
				</label>
				<label className="form-control">
					<span className="label-text">Email</span>
					<input className="input input-bordered" type="email" {...register('email', { required: 'Email is required' })} />
					{errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
				</label>
				<label className="form-control">
					<span className="label-text">Password</span>
					<input className="input input-bordered" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
					{errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
				</label>
				<label className="label cursor-pointer justify-start gap-2">
					<input type="checkbox" className="checkbox" {...register('venueManager')} />
					<span className="label-text">Register as Venue manager</span>
				</label>
						{serverError && <div className="alert alert-error text-sm" role="alert">{serverError}</div>}
				<button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Create account'}</button>
			</form>
						</div>
					</div>
		</div>
	);
}
