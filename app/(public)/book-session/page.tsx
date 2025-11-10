'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../header';
import AvailableSpecialists from './_components/available-specialists';
import PaymentPage from './_components/payment-page';
import PaymentSuccess from './_components/payment-success';
import PersonalInformation from './_components/personal-information';
import SpecialistDetail from './_components/specialist-detail';

function BookSessionContent() {
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');
  const stepParam = searchParams.get('step');

  const [currentStep, setCurrentStep] = useState<'specialists' | 'details' | 'personal-info' | 'payment' | 'success'>('specialists');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  useEffect(() => {
    if (doctorIdParam && stepParam === 'details') {
      const doctorId = Number(doctorIdParam);
      if (!isNaN(doctorId) && doctorId > 0) {
        setSelectedDoctorId(doctorId);
        setCurrentStep('details');
      }
    }
  }, [doctorIdParam, stepParam]);

  const handleSpecialistContinue = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    setCurrentStep('details');
  };

  const handleDetailContinue = (duration: number) => {
    setSelectedDuration(duration);
    setCurrentStep('personal-info');
  };

  const handlePersonalInfoContinue = () => {
    setCurrentStep('payment');
  };

  const handlePaymentContinue = () => {
    setCurrentStep('success');
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('specialists');
    } else if (currentStep === 'personal-info') {
      setCurrentStep('details');
    } else if (currentStep === 'payment') {
      setCurrentStep('personal-info');
    }
  };

  return (
    <div>
      <Header />
      {currentStep === 'specialists' && (
        <AvailableSpecialists onContinue={handleSpecialistContinue} />
      )}
      {currentStep === 'details' && selectedDoctorId && (
        <SpecialistDetail doctorId={selectedDoctorId} onBack={handleBack} onContinue={handleDetailContinue} />
      )}
      {currentStep === 'personal-info' && (
        <PersonalInformation onBack={handleBack} onContinue={handlePersonalInfoContinue} />
      )}
      {currentStep === 'payment' && (
        <PaymentPage duration={selectedDuration || undefined} onBack={handleBack} onContinue={handlePaymentContinue} />
      )}
      {currentStep === 'success' && (
        <PaymentSuccess />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookSessionContent />
    </Suspense>
  );
}

