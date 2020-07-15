import React from 'react';
import {Card, ResponsiveGrid, Box, Divider} from '@alifd/next';
import styles from './index.module.scss';

const {Cell} = ResponsiveGrid;
const DEFAULT_DATA = {
  title: '模块',
};

const FusionCardModulesChart = props => {
  const {cardConfig = DEFAULT_DATA} = props;
  const {title, dataSource} = cardConfig;


  return (
    <Card free>
      <Card.Header title={title}/>
      <Card.Divider/>
      <Card.Content
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <ResponsiveGrid>
          <Cell colSpan={3}>
            <Box direction="row" className={styles.subCard}>
              <Divider direction="ver" className={styles.subDiv}/>
              <div className={styles.subBody}>
                <div className={styles.subName}>
                  <a href={'javascript:;'} onClick={() => {
                    let windowObjectReference = null; // global variable
                    const url = window.location.hostname + ':2636/login#/wallboard';
                    windowObjectReference = window.open(url, '_blank');
                    self.blur();
                  }}>
                    admin管理中心
                  </a>
                </div>
                <Divider direction="hoz"/>
              </div>
            </Box>
          </Cell>
          <Divider direction="ver" className={styles.subMainDiv}/>
          <Cell colSpan={3}>
            <Box direction="row" className={styles.subCard}>
              <Divider direction="ver" className={styles.subDiv}/>
              <div className={styles.subBody}>
                <div className={styles.subName}>
                  <a href={'javascript:;'} onClick={() => {
                    window.open(window.location.hostname + ':2639/xxl-job-admin/', '_blank')
                  }}>
                    定时任务监控
                  </a></div>
                <Divider direction="hoz"/>
              </div>
            </Box>
          </Cell>
        </ResponsiveGrid>
      </Card.Content>
    </Card>
  );
};

export default FusionCardModulesChart;
