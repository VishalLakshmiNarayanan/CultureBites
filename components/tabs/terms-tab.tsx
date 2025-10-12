"use client"

import { GlassCard } from "@/components/glass-card"

export function TermsTab() {
  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <div className="space-y-8 text-gray-900">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Terms and Conditions
            </h1>
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <p className="text-gray-900 leading-relaxed">
              By accessing or using Culture Bridges Services, you agree to be bound by this Terms of Use Agreement (the
              "Terms" or "Agreement"), including our Privacy Policy, Cookie Policy, Community Guidelines, and Safety
              Tips, so it is important that you read this Agreement and these policies and procedures carefully before
              you use our service.
            </p>
          </section>

          {/* Safe Space Pledge */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Safe Space Pledge</h2>
            <p className="text-gray-900 leading-relaxed">
              We, the participants of this program, recognize the importance of creating a safe, inclusive, and
              respectful environment that fosters mutual understanding and learning between international students and
              elderly members of our community. To ensure that this space remains welcoming and supportive for everyone
              involved, we pledge the following:
            </p>

            <div className="space-y-4 mt-4">
              {/* Pledge Item 1 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Respect for All Cultures and Backgrounds</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We honor and celebrate the diverse cultural backgrounds, languages, and experiences that both the
                  international students and the elderly bring to this program. We will approach every interaction with
                  an open mind, appreciating the uniqueness of each individual's heritage and life journey.
                </p>
              </div>

              {/* Pledge Item 2 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Active Listening and Open Communication</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We commit to listening attentively and respectfully to one another. We will engage in meaningful
                  dialogue, being mindful of different communication styles, language proficiencies, and any physical or
                  cognitive needs of the elderly.
                </p>
              </div>

              {/* Pledge Item 3 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Empathy and Patience</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We recognize that learning and cultural exchange may come with challenges. We pledge to be patient,
                  empathetic, and supportive during conversations and activities. We will encourage and uplift one
                  another as we navigate differences in language or perspectives.
                </p>
              </div>

              {/* Pledge Item 4 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Non-Judgmental Environment</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We commit to creating a space where everyone feels safe to express themselves without fear of
                  judgment. We will embrace curiosity and learning, recognizing that mistakes or misunderstandings are
                  natural and part of the learning process.
                </p>
              </div>

              {/* Pledge Item 5 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Privacy and Confidentiality</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We respect the privacy of all participants. Any personal stories or information shared during our
                  interactions will remain confidential, and we will not share them outside of the program without
                  explicit consent.
                </p>
              </div>

              {/* Pledge Item 6 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Zero Tolerance for Discrimination or Harassment</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We will not tolerate any form of discrimination, harassment, or hurtful language based on culture,
                  race, religion, gender, age, language ability, or any other characteristic. Any behavior that
                  undermines the safety and comfort of others will be addressed immediately.
                </p>
              </div>

              {/* Pledge Item 7 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Inclusive Participation</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We commit to ensuring that every participant, whether student or elder, feels valued and included in
                  every activity. We will encourage equal participation and make efforts to accommodate different levels
                  of language proficiency, mobility, or learning styles.
                </p>
              </div>

              {/* Pledge Item 8 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Continuous Learning and Growth</h3>
                <p className="text-gray-900 leading-relaxed pl-4">
                  We acknowledge that cultural exchange is a journey. We pledge to remain curious, open to new
                  experiences, and willing to learn from one another, fostering an environment where everyone can grow.
                </p>
              </div>
            </div>
          </section>
        </div>
      </GlassCard>
    </div>
  )
}
