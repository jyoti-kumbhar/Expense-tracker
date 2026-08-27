import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface LedgerQuickAddWidgetProps {
  todayTotal?: string;
}

export const LedgerQuickAddWidget = ({
  todayTotal = '₹0',
}: LedgerQuickAddWidgetProps) => {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1E0D33',
        borderRadius: 22,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="LEDGER"
        style={{
          color: '#DBB6EE',
          fontSize: 11,
          fontWeight: 'bold',
          letterSpacing: 1.2,
        }}
      />

      {/* Big Add Button */}
      <FlexWidget
        style={{
          backgroundColor: '#7F4CA5',
          borderRadius: 18,
          width: 'match_parent',
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 4,
        }}
        clickAction="OPEN_URI"
        clickActionData={{ uri: 'ledger://add' }}
      >
        <TextWidget
          text="+ Add Expense"
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextWidget
          text="Today: "
          style={{
            color: '#9077AE',
            fontSize: 11,
          }}
        />
        <TextWidget
          text={todayTotal}
          style={{
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
