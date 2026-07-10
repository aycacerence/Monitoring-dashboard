import React from 'react';
import PageContainer from '../../components/layout/PageContainer';

export default function LiveMonitoring() {
  return (
    <PageContainer>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Live Monitoring (Yapım Aşamasında)</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Bu sayfada oluşturulan P&ID diyagramları üzerinden gerçek zamanlı izleme yapılacaktır.
        </p>
      </div>
    </PageContainer>
  );
}
