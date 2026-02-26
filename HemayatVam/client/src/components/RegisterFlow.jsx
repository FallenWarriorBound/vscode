import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const steps = ['تایید شماره', 'رمز عبور', 'اطلاعات هویتی', 'مدارک'];
export default function RegisterFlow() {
  const [step, setStep] = useState(Number(localStorage.getItem('registerStep') || 1));
  const form = useFormik({
    initialValues: JSON.parse(localStorage.getItem('registerForm') || '{"phone":"","password":"","fullName":""}'),
    validationSchema: Yup.object({ phone: Yup.string().required('اجباری') }),
    onSubmit: values => {
      localStorage.setItem('registerForm', JSON.stringify(values));
      const next = Math.min(4, step + 1);
      localStorage.setItem('registerStep', String(next));
      setStep(next);
    }
  });

  return <div className="p-4 bg-white dark:bg-slate-800 rounded-xl">
    <div className="w-full bg-slate-200 rounded-full h-2 mb-4"><div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(step/4)*100}%` }} /></div>
    <p className="mb-2">مرحله {step}: {steps[step-1]}</p>
    <form onSubmit={form.handleSubmit} className="space-y-2">
      <input name="phone" onChange={form.handleChange} value={form.values.phone} placeholder="شماره موبایل" className="w-full p-2 rounded border"/>
      <button className="px-3 py-2 bg-emerald-600 text-white rounded">ادامه</button>
    </form>
  </div>;
}
