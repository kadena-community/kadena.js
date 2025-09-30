'use client';

import { TestVersionForm } from '@/components/TestForm/TestVersionForm';
import { TestRuns } from '@/components/TestRuns/TestRuns';
import type { AppTestVersion } from '@/hooks/getAllAppTestVersions';
import { Button } from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const Home = ({
  params,
}: {
  params: Promise<{ appId: string; testId: string }>;
}) => {
  const { appId, testId } = use(params);
  const router = useRouter();
  const isNew = testId === 'new';

  const handleSuccess = (data: AppTestVersion) => {
    if (data.id) {
      router.push(`/apps/${appId}/tests/${data.id}`);
    }
  };

  const handleTest = async () => {
    // Call your API to run the tests
    await fetch(`/api/test/playwright`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId,
        testId,
        testScript:
          "const { test, expect } = require('@playwright/test');\ntest('dynamic test', async ({ page }) => {\n  await page.goto('http://example.com');\n  await page.screenshot({ path: 'screenshots/d3yn.png' });\n await page.screenshot({ path: 'screenshots/ddynamiffffc2.png' });\n  expect(await page.title()).toBe('Example Domain');\n});",
      }),
    });
  };

  return (
    <>
      <TestVersionForm
        appId={appId}
        testId={testId}
        onSuccess={handleSuccess}
      />

      {!isNew && (
        <>
          <Button onClick={handleTest}>Run tests manually</Button>
          <TestRuns testId={testId} appId={appId} />
        </>
      )}
    </>
  );
};

export default Home;
