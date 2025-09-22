'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-[#1a1a1a] min-h-screen pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-100">Polityka Prywatności</h1>
            
            <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-8 shadow-md text-gray-100">
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#b39a65]">1. Informacje ogólne</h2>
                <p className="mb-4">Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod adresem url: https://www.ascana.pl</p>
                <p className="mb-4">Operatorem serwisu oraz Administratorem danych osobowych jest: ASCANA Sp. z o.o. z siedzibą w Mielcu, Wojska Polskiego 3, 39-300 Mielec, NIP: 6762515504, REGON: 365693032</p>
                <p className="mb-4">Adres kontaktowy poczty elektronicznej operatora: biuro@ascana.pl<br />Telefon: +48 516 516 440</p>
                <p className="mb-4">Operator jest Administratorem Twoich danych osobowych w odniesieniu do danych podanych dobrowolnie w Serwisie.</p>
                <p className="mb-4">Serwis wykorzystuje dane osobowe w następujących celach:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Obsługa zapytań przez formularz</li>
                  <li>Realizacja zamówionych usług</li>
                  <li>Prezentacja oferty lub informacji</li>
                </ul>
                <p className="mb-4">Serwis realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniu w następujący sposób:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Poprzez dobrowolnie wprowadzone w formularzach dane, które zostają wprowadzone do systemów Operatora.</li>
                  <li>Poprzez zapisywanie w urządzeniach końcowych plików cookie (tzw. "ciasteczka").</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#b39a65]">2. Wybrane metody ochrony danych</h2>
                <p className="mb-4">Miejsca logowania i wprowadzania danych osobowych są chronione w warstwie transmisji (certyfikat SSL). Dzięki temu dane osobowe i dane logowania, wprowadzone na stronie, zostają zaszyfrowane w komputerze użytkownika i mogą być odczytane jedynie na docelowym serwerze.</p>
                <p className="mb-4">Dane osobowe przechowywane w bazie danych są zaszyfrowane w taki sposób, że jedynie posiadający Operator klucz może je odczytać. Dzięki temu dane są chronione na wypadek wykradzenia bazy danych z serwera.</p>
                <p className="mb-4">Hasła użytkowników są przechowywane w postaci hashowanej. Funkcja hashująca działa jednokierunkowo - nie jest możliwe odwrócenie jej działania, co stanowi obecnie współczesny standard w zakresie przechowywania haseł użytkowników.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#b39a65]">3. Informacja o plikach cookies</h2>
                <p className="mb-4">Serwis korzysta z plików cookies.</p>
                <p className="mb-4">Pliki cookies (tzw. "ciasteczka") stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do korzystania ze stron internetowych Serwisu. Cookies zazwyczaj zawierają nazwę strony internetowej, z której pochodzą, czas przechowywania ich na urządzeniu końcowym oraz unikalny numer.</p>
                <p className="mb-4">Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Serwisu pliki cookies oraz uzyskującym do nich dostęp jest operator Serwisu.</p>
                <p className="mb-4">Pliki cookies wykorzystywane są w następujących celach:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>utrzymanie sesji użytkownika Serwisu (po zalogowaniu), dzięki której użytkownik nie musi na każdej podstronie Serwisu ponownie wpisywać loginu i hasła;</li>
                  <li>realizacji celów określonych powyżej w części "Informacje ogólne";</li>
                </ul>
                <p className="mb-4">W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików cookies: "sesyjne" (session cookies) oraz "stałe" (persistent cookies). Cookies "sesyjne" są plikami tymczasowymi, które przechowywane są w urządzeniu końcowym Użytkownika do czasu wylogowania, opuszczenia strony internetowej lub wyłączenia oprogramowania (przeglądarki internetowej). "Stałe" pliki cookies przechowywane są w urządzeniu końcowym Użytkownika przez czas określony w parametrach plików cookies lub do czasu ich usunięcia przez Użytkownika.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#b39a65]">4. Zarządzanie plikami cookies</h2>
                <p className="mb-4">Standardowo oprogramowanie służące do przeglądania stron internetowych domyślnie dopuszcza umieszczanie plików cookies na urządzeniu końcowym. Ustawienia te mogą zostać zmienione w taki sposób, aby blokować automatyczną obsługę plików cookies w ustawieniach przeglądarki internetowej bądź informować o ich każdorazowym zamieszczeniu w urządzeniu końcowym użytkownika serwisu internetowego.</p>
                <p className="mb-4">Szczegółowe informacje o możliwości i sposobach obsługi plików cookies dostępne są w ustawieniach oprogramowania (przeglądarki internetowej).</p>
                <p className="mb-4">Operator Serwisu informuje, że ograniczenia stosowania plików cookies mogą wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-[#b39a65]">5. Informacja o przetwarzaniu danych osobowych</h2>
                <p className="mb-4">Zgodnie z art. 13 ust. 1 i ust. 2 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO), informujemy, że:</p>
                <p className="mb-4">Administratorem Pani/Pana danych osobowych jest ASCANA Sp. z o.o. z siedzibą w Mielcu, Wojska Polskiego 3, 39-300 Mielec, NIP: 6762515504, REGON: 365693032, adres e-mail: biuro@ascana.pl, tel. +48 516 516 440.</p>
                <p className="mb-4">Przetwarzanie Pani/Pana danych osobowych będzie się odbywać na podstawie art. 6 ust. 1 lit. a, b, c, f RODO w celu realizacji usług oferowanych przez Administratora oraz wypełnienia obowiązku prawnego ciążącego na Administratorze lub w celu realizacji prawnie uzasadnionego interesu Administratora.</p>
                <p className="mb-4">Administrator powołuje się na prawnie uzasadniony interes, którym jest analiza danych zebranych automatycznie w celu lepszego dostosowania treści oraz monitorowanie aktywności i zapewnienie bezpieczeństwa usługi.</p>
                <p className="mb-4">Pani/Pana dane osobowe będą przechowywane przez okres niezbędny do realizacji celów przetwarzania, a po tym czasie przez okres wymagany przez przepisy prawa lub dla realizacji ewentualnych roszczeń.</p>
                <p className="mb-4">Posiada Pani/Pan prawo dostępu do treści swoich danych osobowych, prawo do ich sprostowania, usunięcia, jak również prawo do ograniczenia ich przetwarzania, prawo do przenoszenia danych, prawo do wniesienia sprzeciwu wobec przetwarzania Pani/Pana danych osobowych.</p>
                <p className="mb-4">Przysługuje Pani/Panu prawo wniesienia skargi do organu nadzorczego, jeśli Pani/Pana zdaniem, przetwarzanie danych osobowych Pani/Pana - narusza przepisy unijnego rozporządzenia RODO.</p>
                <p className="mb-4">Podanie przez Panią/Pana danych osobowych jest dobrowolne, ale niezbędne do realizacji wskazanych celów.</p>
                <p className="mb-4">Niniejsza Polityka Prywatności obowiązuje od dnia 1 września 2023 roku.</p>
              </section>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="inline-block bg-[#b39a65] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a38a55] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Powrót do strony głównej
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}