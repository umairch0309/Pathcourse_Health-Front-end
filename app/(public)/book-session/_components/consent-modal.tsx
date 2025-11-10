'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';

type ConsentModalProps = {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
};

export default function ConsentModal({ open, onClose, onAgree }: ConsentModalProps) {
  const consentPoints = [
    {
      title: 'Authorization for Telehealth Services',
      content:
        'By proceeding with this consultation, I authorize the Open Ear medical team to review my health information and provide care using telemedicine technologies. This may include real-time video/audio communication and asynchronous (store-and-forward) review of my medical data and related information.',
    },
    {
      title: 'Authorization for Alternative Prescriptions',
      content:
        'I understand and agree that the Open Ear medical team may prescribe an alternative treatment or medication if my preferred option is found to be unsafe, potentially harmful, controlled, or incompatible with my current medications or medical history.',
    },
    {
      title: 'Scope of Telemedicine Services',
      content:
        'I acknowledge that Open Ear consultations are designed for non-emergency and mild to moderate health concerns. The platform reserves the right to decline, cancel, or refer care if my condition is determined to be complex or requires immediate, in-person medical attention.',
    },
    {
      title: 'Accuracy of Information',
      content:
        'I confirm that all information I provide—including my medical history, symptoms, and medications—is accurate and complete to the best of my knowledge. I understand that the quality of medical advice provided is dependent on the accuracy of the information I submit and that no physical examination is performed during the virtual visit.',
    },
    {
      title: 'Acknowledgment of Telemedicine Limitations',
      content:
        'I understand that telemedicine has inherent limitations, including the possibility of incomplete assessment or misdiagnosis due to the absence of a physical examination.',
    },
    {
      title: 'Follow-Up and Emergency Protocol',
      content:
        'I agree to seek in-person follow-up care if my symptoms worsen, do not improve, or require additional evaluation. In the case of severe or life-threatening symptoms, I agree to call 911 or go to the nearest emergency department immediately.',
    },
    {
      title: 'Consent Confirmation',
      content:
        'By submitting my information and continuing with this telehealth consultation, I confirm that I have read, understood, and agree to the terms of this Informed Consent and Authorization for treatment via the Open Ear telemedicine platform.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Informed Consent & Authorization
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {consentPoints.map((point, index) => (
            <div key={index} className="space-y-2">
              <Typography variant="p" className="text-foreground font-normal text-sm">
                {index + 1}. {point.title}
              </Typography>
              <Typography variant="span" className="text-foreground text-xs">
                {point.content}
              </Typography>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onAgree}>
            I agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

