import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface LedgerSummaryWidgetProps {
  monthName?: string;
  monthTotal?: string;
  todayTotal?: string;
  budgetStatus?: string;
}

export const LedgerSummaryWidget = ({
  monthName = 'This Month',
  monthTotal = '₹0',
  todayTotal = '₹0',
  budgetStatus = 'No budget limit',
}: LedgerSummaryWidgetProps) => {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1E0D33',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Top Header: Brand & Month */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextWidget
          text="LEDGER"
          style={{
            color: '#DBB6EE',
            fontSize: 12,
            fontWeight: 'bold',
            letterSpacing: 1.5,
          }}
        />
        <TextWidget
          text={monthName}
          style={{
            color: '#B57EDC',
            fontSize: 11,
            fontWeight: '600',
          }}
        />
      </FlexWidget>

      {/* Main Stats Row: Spending Highlight & Quick Add */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 4,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'column',
          }}
        >
          <TextWidget
            text="Spent this month"
            style={{
              color: '#9077AE',
              fontSize: 11,
              fontWeight: '500',
            }}
          />
          <TextWidget
            text={monthTotal}
            style={{
              color: '#FFFFFF',
              fontSize: 26,
              fontWeight: 'bold',
              marginTop: 2,
            }}
          />
        </FlexWidget>

        {/* 1-Tap Add Expense Button */}
        <FlexWidget
          style={{
            backgroundColor: '#7F4CA5',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'ledger://add' }}
        >
          <TextWidget
            text="+ Add"
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Bottom Bar: Today Total & Budget Remaining */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2A1245',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
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
              color: '#FFF0FF',
              fontSize: 11,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        <TextWidget
          text={budgetStatus}
          style={{
            color: '#DBB6EE',
            fontSize: 11,
            fontWeight: '600',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
