import { tokens } from "@kadena/kode-ui/styles";
import styles from './box.module.css';

export const Box = ({ children }: { children: React.ReactNode }) => {
  return <div
    style={{
      fontSize: tokens.kda.foundation.typography.fontSize.xl,
      fontWeight: tokens.kda.foundation.typography.weight.primaryFont.bold,
      color: tokens.kda.foundation.color.text.brand.primary.default,
      fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
    }}
    className={styles.box}>
      { children }
    </div>;
}

export const LabeledBox = ({ children, label }: { children: React.ReactNode; label: string }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.kda.foundation.spacing.xs }}>
      <span style={{
        color: tokens.kda.foundation.color.text.gray.default,
        fontSize: tokens.kda.foundation.typography.fontSize.xs,
        fontWeight: tokens.kda.foundation.typography.weight.primaryFont.regular,
        fontFamily: tokens.kda.foundation.typography.family.primaryFont,
      }}>
        { label }
      </span>
      <div
        style={{
          fontSize: tokens.kda.foundation.typography.fontSize.sm,
          fontWeight: tokens.kda.foundation.typography.weight.primaryFont.bold,
          color: tokens.kda.foundation.color.text.brand.primary.default,
          fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
          gap: tokens.kda.foundation.spacing.xs,
        }}
        className={styles.box}>
        { children }
      </div>
    </div>
  );
}
