import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout'

export default function FirstPost() {
    return (
      <Layout>
        <Head>
          <title>First Post</title>
        </Head>
        <h1>First Post</h1>
        <p>
          This is an example of a statically generated page with no SSR.
        </p>
        <p>
          <button onClick={handleClick}>CLICK ME</button> - This button will let you send an event to newrelic          
        </p>        
        <p>
          <button onClick={errorClick}>CLICK ME</button> - This button however will throw a javascript error, sad times.
        </p>
        <p>
          <button onClick={handledErrorClick}>CLICK ME</button> - This one also throws an error, but it's handled!
        </p>
      </Layout>
    )
  }

  const handleClick = (e) => {
    console.log('This is an example click handler');    
    newrelic.addPageAction('NRDemoClickEvent');
    alert('We sent an event to newrelic!');
  }

  const errorClick = (e) => {
    const a = 'some_text';
    a.callfunction();
  }

  const handledErrorClick = (e) => {
    try {
      const a = 'other_text';
      a.callfunction();
    } catch (e) {
      console.log('We caught a javascript error! But we can still tell New Relic about it!');      
      console.log('To get a stack trace however for Safari and IE, we need to re-throw the error again...');
      try {
        throw e;
      } catch (err) {
        newrelic.noticeError(err);
      }
    }
  }

