import React from 'react';
import PageContainer from '../../components/layout/PageContainer';

export default function PIDBuilder() {
  return (
    <PageContainer>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">PID Builder (Yapım Aşamasında)</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Bu sayfada sürükle-bırak yöntemiyle P&ID diyagramları oluşturulacak.
        </p>
      </div>
    </PageContainer>
  );
}
