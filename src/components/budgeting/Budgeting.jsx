import React, { useEffect, useState } from 'react';
import styleBudget from "./Budgeting.module.css";
import { usesType as fetchUsesType } from '../../services/api';
import { Summary } from '../summary/Summary';
import { BudgetingUseCase } from '../budgetingUseCase/BudgetingUseCase';
import { Loader } from '../loader/Loder';

export const Budgeting = ({ loanId, loanDetailsId }) => {
  const [activeTab, setActiveTab] = useState('summary'); // Default to summary or first tab
  const [tabs, setTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsesTypeData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchUsesType(loanId);

        if (res && res.data && res.data.uses_type) {
          const fetchedTabs = res.data.uses_type.map((type) => {
            const formattedLabel = type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize words
            return { name: type, label: formattedLabel };
          });

          setTabs([
            ...fetchedTabs,
            { name: 'summary', label: 'Summary', rounded: 'right' }
          ]);

          // Set default active tab to the first fetched tab
          setActiveTab(fetchedTabs[0].name);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsesTypeData();
  }, [loanId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    if (activeTab === 'summary') {
      return <Summary loanDetailsId={loanDetailsId} loanId={loanId} />;
    }
    return <BudgetingUseCase loanId={loanId} usesType={activeTab} loanDetailsId={loanDetailsId}/>;
  };

  return (
    <>
      {isLoading ? (
        <div className={styleBudget.loaderDiv}>
           <Loader />
        </div>
       
      ) : (
        <div className={styleBudget.main} style={{ padding: "0rem 0 0 0rem" }}>
          <div className={styleBudget.tabs}>
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                style={{
                  borderTopLeftRadius: index === 0 ? '8px' : '0', 
                  borderBottomLeftRadius: index === 0 ? '8px' : '0', 
                  borderTopRightRadius: tab.rounded === 'right' ? '8px' : '0',
                  borderBottomRightRadius: tab.rounded === 'right' ? '8px' : '0',
                }}
                onClick={() => handleTabClick(tab.name)}
                className={`${styleBudget.tabButton} ${activeTab === tab.name ? styleBudget.activeTab : styleBudget.inactiveTab}`}
              >
                <span style={{ fontSize: "15px", color: "white" }}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div style={{ paddingTop: "0rem" }}>
            {renderTabContent()}
          </div>
        </div>
      )}
    </>
  );
};
